import { stat } from 'node:fs/promises';
import pLimit from 'p-limit';

import { loadCache, saveCache } from './cache.ts';
import { loadConfig, type Config } from './config.ts';
import { hashFile } from './hash.ts';
import { buildManifest, toPhoto, variantKey } from './manifest.ts';
import { createS3, putObject, type S3 } from './s3.ts';
import { transform } from './transform.ts';
import type { Cache, CachedPhoto, Photo } from './types.ts';
import { walk, type FileEntry } from './walk.ts';

const CACHE_IMMUTABLE = 'public, max-age=31536000, immutable';
const CACHE_MANIFEST = 'public, max-age=0, must-revalidate';

export const sync = async () => {
  const config = loadConfig();

  console.log(`scanning ${config.photosDir}…`);

  let files: FileEntry[];
  try {
    files = await walk(config.photosDir);
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      throw new Error(`photos dir not found: ${config.photosDir}`);
    }

    throw err;
  }
  const chapters = new Set(files.map((f) => f.chapter));
  console.log(
    `found ${files.length} photos in ${chapters.size} chapters: ${[...chapters].join(', ')}`,
  );

  const cache = await loadCache();
  const present = new Set(files.map((f) => f.relPath));

  for (const key of Object.keys(cache.photos)) {
    if (!present.has(key)) {
      delete cache.photos[key];
    }
  }

  const s3 = createS3(config.env);
  const stats: SyncStats = { uploaded: 0, skipped: 0, failed: 0, bytes: 0 };
  const limit = pLimit(config.args.concurrency);
  const photos: Photo[] = [];
  let lastSave = Date.now();

  await Promise.all(
    files.map((file) =>
      limit(async () => {
        try {
          const cached = await processOne({ file, cache, s3, config, stats });

          if (cached) {
            photos.push(toPhoto({ cached, baseUrl: config.env.PUBLIC_BASE_URL }));
          }

          if (!config.args.dryRun && Date.now() - lastSave > 5000) {
            lastSave = Date.now();
            await saveCache(cache);
          }
        } catch (err) {
          stats.failed++;
          console.error(`  ! ${file.relPath}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }),
    ),
  );

  if (!config.args.dryRun) {
    await saveCache(cache);
  }

  if (config.args.dryRun) {
    console.log(
      `\ndry-run: ${stats.uploaded} would upload, ${stats.skipped} unchanged, ${stats.failed} failed`,
    );

    return;
  }

  const manifest = buildManifest(photos);
  await putObject({
    s3,
    key: config.env.MANIFEST_KEY,
    body: JSON.stringify(manifest),
    contentType: 'application/json',
    cacheControl: CACHE_MANIFEST,
  });

  const mb = (stats.bytes / 1024 / 1024).toFixed(1);
  console.log(
    `\ndone. uploaded: ${stats.uploaded}, skipped: ${stats.skipped}, failed: ${stats.failed}, ${mb} MB to S3`,
  );
  console.log(`manifest → s3://${config.env.S3_BUCKET}/${config.env.MANIFEST_KEY}`);
};

type SyncStats = {
  uploaded: number;
  skipped: number;
  failed: number;
  bytes: number;
};

type ProcessOneParams = {
  file: FileEntry;
  cache: Cache;
  s3: S3;
  config: Config;
  stats: SyncStats;
};

const processOne = async ({
  file,
  cache,
  s3,
  config,
  stats,
}: ProcessOneParams): Promise<CachedPhoto | null> => {
  const cached = cache.photos[file.relPath];
  const fileStats = await stat(file.absPath);
  const forced = config.args.force ? file.relPath.includes(config.args.force) : false;

  const unchanged =
    !forced && cached && cached.size === fileStats.size && cached.mtimeMs === fileStats.mtimeMs;

  if (unchanged) {
    stats.skipped++;

    return cached;
  }

  const id = await hashFile(file.absPath);

  if (!forced && cached?.id === id) {
    const refreshed: CachedPhoto = { ...cached, mtimeMs: fileStats.mtimeMs, size: fileStats.size };
    cache.photos[file.relPath] = refreshed;
    stats.skipped++;

    return refreshed;
  }

  if (config.args.dryRun) {
    console.log(`  + ${file.relPath} (${id})`);
    stats.uploaded++;

    return null;
  }

  const result = await transform(file.absPath);

  await Promise.all(
    result.variants.map((v) =>
      putObject({
        s3,
        key: variantKey({ id, size: v.size, format: v.format }),
        body: v.buffer,
        contentType: `image/${v.format}`,
        cacheControl: CACHE_IMMUTABLE,
      }),
    ),
  );

  for (const v of result.variants) {
    stats.bytes += v.buffer.byteLength;
  }

  const photo: CachedPhoto = {
    id,
    chapter: file.chapter,
    order: file.order,
    width: result.width,
    height: result.height,
    blurhash: result.blurhash,
    sourcePath: file.relPath,
    mtimeMs: fileStats.mtimeMs,
    size: fileStats.size,
  };

  cache.photos[file.relPath] = photo;
  stats.uploaded++;
  console.log(`  ${id} ${file.relPath}`);

  return photo;
};
