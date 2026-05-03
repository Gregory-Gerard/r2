import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { defineConfig, searchForWorkspaceRoot } from 'vite-plus';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

import { r2Photos } from './plugins/r2-photos.ts';

const repoRoot = searchForWorkspaceRoot(import.meta.dirname);
const envFile = resolve(repoRoot, '.env.local');

if (existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const baseUrl = process.env.PUBLIC_BASE_URL;

if (!baseUrl) {
  throw new Error('PUBLIC_BASE_URL is not set (define it in .env.local at the repo root)');
}

const heroImageUrl = process.env.VITE_HERO_IMAGE_URL ?? '/hero-couple.jpg';

const htmlVars = () => ({
  name: 'r2-html-vars',
  transformIndexHtml: (html: string) => html.replaceAll('%HERO_IMAGE_URL%', heroImageUrl),
});

export default defineConfig({
  envDir: repoRoot,
  plugins: [react(), tailwindcss(), r2Photos({ baseUrl }), htmlVars()],
});
