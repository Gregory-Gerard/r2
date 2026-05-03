import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { mkdir, readFile, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vite-plus/test';

import { sync } from './sync.ts';
import { VARIANT_FORMATS, VARIANT_SIZES, type Cache, type Manifest } from './types.ts';

type Put = {
  Key: string;
  Body: Buffer | string;
  ContentType: string;
  CacheControl: string;
};

const VARIANTS_PER_PHOTO = VARIANT_SIZES.length * VARIANT_FORMATS.length;

let tempRoot: string;
let photosDir: string;
let cachePath: string;
let puts: Put[];

const makeJpeg = (path: string, hue: number) =>
  sharp({
    create: {
      width: 64,
      height: 48,
      channels: 3,
      background: { r: hue % 255, g: (hue * 2) % 255, b: (hue * 3) % 255 },
    },
  })
    .jpeg({ quality: 80 })
    .toFile(path);

const planChapter = async (chapter: string, ids: number[]) => {
  const dir = join(photosDir, chapter);
  await mkdir(dir, { recursive: true });

  for (const i of ids) {
    await makeJpeg(join(dir, `photo-${i}.jpg`), i);
  }
};

const photoPuts = () => puts.filter((p) => p.Key.startsWith('photos/'));
const manifestPuts = () => puts.filter((p) => p.Key === 'manifest.json');
const readCache = async (): Promise<Cache> => JSON.parse(await readFile(cachePath, 'utf8'));

beforeEach(() => {
  tempRoot = mkdtempSync(join(tmpdir(), 'r2-photos-'));
  photosDir = join(tempRoot, 'photos');
  cachePath = join(tempRoot, 'cache.json');
  puts = [];

  process.env.PHOTOS_DIR = photosDir;
  process.env.S3_BUCKET = 'test-bucket';
  process.env.S3_REGION = 'us-east-1';
  process.env.S3_ACCESS_KEY_ID = 'test-key';
  process.env.S3_SECRET_ACCESS_KEY = 'test-secret';
  process.env.S3_ENDPOINT = 'http://localhost:9000';
  process.env.PUBLIC_BASE_URL = 'https://cdn.example.test';
  process.env.MANIFEST_KEY = 'manifest.json';
  process.env.PHOTOS_CACHE_PATH = cachePath;
  process.argv = ['node', 'cli'];

  vi.spyOn(S3Client.prototype, 'send').mockImplementation(async (cmd: unknown) => {
    puts.push((cmd as PutObjectCommand).input as Put);

    return {} as never;
  });
});

afterEach(() => {
  rmSync(tempRoot, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('sync', () => {
  test('uploads variants and manifest with correct keys and headers', async () => {
    await planChapter('cocktail', [1, 2, 3]);
    await planChapter('ceremony', [1, 2, 3]);

    await sync();

    const photos = photoPuts();
    expect(photos).toHaveLength(6 * VARIANTS_PER_PHOTO);

    for (const p of photos) {
      expect(p.CacheControl).toBe('public, max-age=31536000, immutable');
      expect(p.ContentType).toMatch(/^image\/(avif|webp)$/);
      expect(p.Key).toMatch(/^photos\/[a-f0-9]{12}\/w(400|800|1600|2400)\.(avif|webp)$/);
    }

    const [manifestPut] = manifestPuts();
    expect(manifestPut.CacheControl).toBe('public, max-age=0, must-revalidate');
    expect(manifestPut.ContentType).toBe('application/json');

    const manifest = JSON.parse(manifestPut.Body as string) as Manifest;
    expect(manifest.version).toBe(1);
    expect(manifest.photos.map((p) => p.chapter)).toEqual([
      'ceremony',
      'ceremony',
      'ceremony',
      'cocktail',
      'cocktail',
      'cocktail',
    ]);
    expect(manifest.photos.map((p) => p.order)).toEqual([1, 2, 3, 1, 2, 3]);

    const sample = manifest.photos[0];
    expect(sample.sources.avif[400]).toBe(`https://cdn.example.test/photos/${sample.id}/w400.avif`);
    expect(sample.width).toBe(64);
    expect(sample.height).toBe(48);
  });

  test('idempotent re-run uploads no variants', async () => {
    await planChapter('cocktail', [1, 2]);
    await sync();

    puts = [];
    await sync();

    expect(photoPuts()).toHaveLength(0);
    expect(manifestPuts()).toHaveLength(1);
  });

  test('mtime touch with same content does not re-upload', async () => {
    await planChapter('cocktail', [1]);
    await sync();

    const before = (await readCache()).photos['cocktail/photo-1.jpg'];
    puts = [];

    const future = new Date(Date.now() + 60_000);
    await utimes(join(photosDir, 'cocktail', 'photo-1.jpg'), future, future);

    await sync();

    expect(photoPuts()).toHaveLength(0);

    const after = (await readCache()).photos['cocktail/photo-1.jpg'];
    expect(after.id).toBe(before.id);
    expect(after.mtimeMs).not.toBe(before.mtimeMs);
  });

  test('content change re-uploads only the affected file', async () => {
    await planChapter('cocktail', [1, 2]);
    await sync();

    const oldId = (await readCache()).photos['cocktail/photo-1.jpg'].id;
    puts = [];

    await makeJpeg(join(photosDir, 'cocktail', 'photo-1.jpg'), 999);
    await sync();

    expect(photoPuts()).toHaveLength(VARIANTS_PER_PHOTO);
    expect((await readCache()).photos['cocktail/photo-1.jpg'].id).not.toBe(oldId);
  });

  test('prunes cache entries whose source path is gone', async () => {
    await planChapter('cocktail', [1]);
    const seed: Cache = {
      version: 1,
      photos: {
        'ghost/photo-99.jpg': {
          id: 'deadbeefcafe',
          chapter: 'ghost',
          order: 99,
          width: 64,
          height: 48,
          blurhash: 'L00000fQfQfQfQfQfQfQ',
          sourcePath: 'ghost/photo-99.jpg',
          mtimeMs: 0,
          size: 0,
        },
      },
    };
    await writeFile(cachePath, JSON.stringify(seed));

    await sync();

    expect((await readCache()).photos['ghost/photo-99.jpg']).toBeUndefined();
  });

  test('dry-run uploads nothing and writes no cache', async () => {
    await planChapter('cocktail', [1]);
    process.argv = ['node', 'cli', '--dry-run'];

    await sync();

    expect(puts).toHaveLength(0);
    expect(existsSync(cachePath)).toBe(false);
  });

  test('--force re-uploads only paths matching the substring', async () => {
    await planChapter('cocktail', [1]);
    await mkdir(join(photosDir, 'ceremony'), { recursive: true });
    await makeJpeg(join(photosDir, 'ceremony', 'photo-1.jpg'), 100);
    await sync();

    const cache = await readCache();
    const cocktailId = cache.photos['cocktail/photo-1.jpg'].id;
    expect(cocktailId).not.toBe(cache.photos['ceremony/photo-1.jpg'].id);

    puts = [];
    process.argv = ['node', 'cli', '--force', 'cocktail'];
    await sync();

    const variants = photoPuts();
    expect(variants).toHaveLength(VARIANTS_PER_PHOTO);
    expect(variants.every((v) => v.Key.startsWith(`photos/${cocktailId}/`))).toBe(true);
  });

  test('manifest sorts orders numerically', async () => {
    await planChapter('cocktail', [1, 2, 10]);
    await sync();

    const manifest = JSON.parse(manifestPuts()[0].Body as string) as Manifest;
    expect(manifest.photos.map((p) => p.order)).toEqual([1, 2, 10]);
  });
});
