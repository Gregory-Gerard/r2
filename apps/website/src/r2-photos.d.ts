declare module 'virtual:r2-photos' {
  export type PhotoFormat = 'avif' | 'webp';
  export type PhotoSize = 400 | 800 | 1600 | 2400;

  export type Photo = {
    id: string;
    chapter: string;
    order: number;
    width: number;
    height: number;
    blurhash: string;
  };

  export type Manifest = {
    version: 1;
    generatedAt: string;
    photos: Photo[];
  };

  export const manifest: Manifest;
  export const photos: Photo[];
  export const photoUrl: (id: string, format: PhotoFormat, size: PhotoSize) => string;
}
