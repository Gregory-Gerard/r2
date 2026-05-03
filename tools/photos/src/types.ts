import { z } from 'zod';

export const VARIANT_SIZES = [400, 800, 1600, 2400] as const;
export type VariantSize = (typeof VARIANT_SIZES)[number];

export const VARIANT_FORMATS = ['avif', 'webp'] as const;
export type VariantFormat = (typeof VARIANT_FORMATS)[number];

export type Sources = Record<VariantFormat, Record<VariantSize, string>>;

export type Photo = {
  id: string;
  chapter: string;
  order: number;
  width: number;
  height: number;
  blurhash: string;
  sources: Sources;
};

export type Manifest = {
  version: 1;
  generatedAt: string;
  photos: Photo[];
};

export const cachedPhotoSchema = z.object({
  id: z.string(),
  chapter: z.string(),
  order: z.number(),
  width: z.number(),
  height: z.number(),
  blurhash: z.string(),
  sourcePath: z.string(),
  mtimeMs: z.number(),
  size: z.number(),
});

export type CachedPhoto = z.infer<typeof cachedPhotoSchema>;

export const cacheSchema = z.object({
  version: z.literal(1),
  photos: z.record(z.string(), cachedPhotoSchema),
});

export type Cache = z.infer<typeof cacheSchema>;
