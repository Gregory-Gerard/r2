import {
  VARIANT_FORMATS,
  VARIANT_SIZES,
  type CachedPhoto,
  type Manifest,
  type Photo,
  type Sources,
  type VariantFormat,
  type VariantSize,
} from './types.ts';

type VariantKeyParams = {
  id: string;
  size: VariantSize;
  format: VariantFormat;
};

export const variantKey = ({ id, size, format }: VariantKeyParams) =>
  `photos/${id}/w${size}.${format}`;

type BuildSourcesParams = {
  id: string;
  baseUrl: string;
};

export const buildSources = ({ id, baseUrl }: BuildSourcesParams): Sources => {
  const base = baseUrl.replace(/\/+$/, '');
  const sources = {} as Sources;

  for (const format of VARIANT_FORMATS) {
    sources[format] = {} as Record<(typeof VARIANT_SIZES)[number], string>;

    for (const size of VARIANT_SIZES) {
      sources[format][size] = `${base}/${variantKey({ id, size, format })}`;
    }
  }

  return sources;
};

type ToPhotoParams = {
  cached: CachedPhoto;
  baseUrl: string;
};

export const toPhoto = ({ cached, baseUrl }: ToPhotoParams): Photo => ({
  id: cached.id,
  chapter: cached.chapter,
  order: cached.order,
  width: cached.width,
  height: cached.height,
  blurhash: cached.blurhash,
  sources: buildSources({ id: cached.id, baseUrl }),
});

export const buildManifest = (photos: Photo[]): Manifest => ({
  version: 1,
  generatedAt: new Date().toISOString(),
  photos: photos.slice().sort((a, b) => {
    if (a.chapter !== b.chapter) {
      return a.chapter.localeCompare(b.chapter);
    }

    if (a.order !== b.order) {
      return a.order - b.order;
    }

    return a.id.localeCompare(b.id);
  }),
});
