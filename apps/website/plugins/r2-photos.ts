import type { Plugin } from 'vite-plus';

type R2PhotosOptions = {
  baseUrl: string;
};

const VIRTUAL_ID = 'virtual:r2-photos';
const RESOLVED_ID = `\0${VIRTUAL_ID}`;

export const r2Photos = ({ baseUrl }: R2PhotosOptions): Plugin => {
  let manifestModule: string | null = null;

  return {
    name: 'r2-photos',
    async buildStart() {
      const url = `${baseUrl.replace(/\/+$/, '')}/manifest.json`;
      const res = await fetch(url);

      if (!res.ok) {
        this.error(`failed to fetch r2 photos manifest at ${url}: ${res.status} ${res.statusText}`);
      }

      const json = await res.text();
      manifestModule = `export const manifest = ${json};\nexport const photos = manifest.photos;\n`;
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
