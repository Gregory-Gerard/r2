import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { cacheSchema, type Cache } from './types.ts';

const PKG_DIR = resolve(fileURLToPath(import.meta.url), '../..');
const DEFAULT_CACHE_PATH = resolve(PKG_DIR, '.cache/index.json');

export const cachePath = () => process.env.PHOTOS_CACHE_PATH ?? DEFAULT_CACHE_PATH;

export const loadCache = async (): Promise<Cache> => {
  const path = cachePath();

  let raw: string;
  try {
    raw = await readFile(path, 'utf8');
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      return { version: 1, photos: {} };
    }

    throw err;
  }

  return cacheSchema.parse(JSON.parse(raw));
};

export const saveCache = async (cache: Cache) => {
  const path = cachePath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(cache));
};
