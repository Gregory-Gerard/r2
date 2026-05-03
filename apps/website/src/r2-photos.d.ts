declare module 'virtual:r2-photos' {
  export type Photo = {
    id: string;
    chapter: string;
    order: number;
    width: number;
    height: number;
    blurhash: string;
    sources: {
      avif: { 400: string; 800: string; 1600: string; 2400: string };
      webp: { 400: string; 800: string; 1600: string; 2400: string };
    };
  };

  export type Manifest = {
    version: 1;
    generatedAt: string;
    photos: Photo[];
  };

  export const manifest: Manifest;
  export const photos: Photo[];
}
