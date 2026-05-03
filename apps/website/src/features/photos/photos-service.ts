import { photos, photoUrl, type PhotoFormat, type Photo } from 'virtual:r2-photos';

const VARIANT_SIZES = [400, 800, 1600, 2400] as const;

const byChapter: Map<string, Photo[]> = (() => {
  const map = new Map<string, Photo[]>();

  for (const photo of photos) {
    const list = map.get(photo.chapter) ?? [];
    list.push(photo);
    map.set(photo.chapter, list);
  }

  return map;
})();

export const getPhotosByChapter = (slug: string): Photo[] => byChapter.get(slug) ?? [];

export const getChapterCount = (slug: string): number => byChapter.get(slug)?.length ?? 0;

export const buildSrcSet = (id: string, format: PhotoFormat) =>
  VARIANT_SIZES.map((size) => `${photoUrl(id, format, size)} ${size}w`).join(', ');

export { photoUrl };
export type { Photo };
