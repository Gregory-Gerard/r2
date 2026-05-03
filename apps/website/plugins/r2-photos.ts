import type { Plugin } from 'vite-plus';

type R2PhotosOptions = {
  baseUrl: string;
};

const VIRTUAL_ID = 'virtual:r2-photos';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

type RawPhoto = {
  id: string;
  chapter: string;
  order: number;
  width: number;
  height: number;
  blurhash: string;
  sources?: unknown;
};

type RawManifest = {
  version: number;
  generatedAt: string;
  photos: RawPhoto[];
};

export const r2Photos = ({ baseUrl }: R2PhotosOptions): Plugin => {
  const cdnBase = baseUrl.replace(/\/+$/, '');
  let manifestModule: string | null = null;

  return {
    name: 'r2-photos',
    async buildStart() {
      const url = `${cdnBase}/manifest.json`;
      const res = await fetch(url);

      if (!res.ok) {
        this.error(`failed to fetch r2 photos manifest at ${url}: ${res.status} ${res.statusText}`);
      }

      const raw: RawManifest = await res.json();
      const trimmed = {
        version: raw.version,
        generatedAt: raw.generatedAt,
        photos: raw.photos.map(({ id, chapter, order, width, height, blurhash }) => ({
          id,
          chapter,
          order,
          width,
          height,
          blurhash,
        })),
      };

      manifestModule = [
        `export const manifest = ${JSON.stringify(trimmed)};`,
        `export const photos = manifest.photos;`,
        `const baseUrl = ${JSON.stringify(cdnBase)};`,
        `export const photoUrl = (id, format, size) => \`\${baseUrl}/photos/\${id}/w\${size}.\${format}\`;`,
        '',
      ].join('\n');
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID;
      }
    },
    load(id) {
      if (id === RESOLVED_ID) {
        return manifestModule;
      }
    },
  };
};
