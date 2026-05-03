import { readFile } from 'node:fs/promises';

import sharp from 'sharp';
import { encode as encodeBlurhash } from 'blurhash';

import { VARIANT_FORMATS, VARIANT_SIZES, type VariantFormat, type VariantSize } from './types.ts';

// EXIF orientation values 5-8 indicate a 90° or 270° rotation, which swaps
// the image's logical width and height. Values 1-4 keep the original axes.
const EXIF_ORIENTATION_DEFAULT = 1;
const EXIF_ORIENTATION_ROTATED_MIN = 5;
const EXIF_ORIENTATION_ROTATED_MAX = 8;

const isRotated = (orientation: number) =>
  orientation >= EXIF_ORIENTATION_ROTATED_MIN && orientation <= EXIF_ORIENTATION_ROTATED_MAX;

export type Variant = {
  size: VariantSize;
  format: VariantFormat;
  buffer: Buffer;
};

export type TransformResult = {
  width: number;
  height: number;
  blurhash: string;
  variants: Variant[];
};

const encodeVariant = async (
  input: sharp.Sharp,
  size: VariantSize,
  format: VariantFormat,
): Promise<Variant> => {
  const pipe = input.clone().resize({ width: size, withoutEnlargement: true });
  const buffer =
    format === 'avif'
      ? await pipe.avif({ quality: 60, effort: 4 }).toBuffer()
      : await pipe.webp({ quality: 80 }).toBuffer();

  return { size, format, buffer };
};

export const transform = async (sourcePath: string): Promise<TransformResult> => {
  const source = await readFile(sourcePath);
  const input = sharp(source, { failOn: 'error' }).rotate();
  const meta = await input.metadata();

  if (!meta.width || !meta.height) {
    throw new Error(`could not read dimensions: ${sourcePath}`);
  }

  const rotated = isRotated(meta.orientation ?? EXIF_ORIENTATION_DEFAULT);
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;

  const [blurhash, variants] = await Promise.all([
    generateBlurhash(input),
    Promise.all(
      VARIANT_SIZES.flatMap((size) =>
        VARIANT_FORMATS.map((format) => encodeVariant(input, size, format)),
      ),
    ),
  ]);

  return { width, height, blurhash, variants };
};

const generateBlurhash = async (input: sharp.Sharp): Promise<string> => {
  const { data, info } = await input
    .clone()
    .raw()
    .ensureAlpha()
    .resize(32, 32, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true });

  return encodeBlurhash(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
};
