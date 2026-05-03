import { decode } from 'blurhash';

const cache = new Map<string, string>();

export const blurhashToDataUrl = (hash: string, width = 32, height = 32): string => {
  const key = `${hash}|${width}x${height}`;
  const hit = cache.get(key);

  if (hit) {
    return hit;
  }

  if (typeof document === 'undefined') {
    return '';
  }

  const pixels = decode(hash, width, height);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  const image = ctx.createImageData(width, height);
  image.data.set(pixels);
  ctx.putImageData(image, 0, 0);

  const url = canvas.toDataURL();
  cache.set(key, url);

  return url;
};
