import { parseArgs } from 'node:util';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { z } from 'zod';

const envSchema = z.object({
  PHOTOS_DIR: z.string().default('.photos'),
  S3_ENDPOINT: z.url().optional(),
  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().default('eu-west-3'),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  PUBLIC_BASE_URL: z.url(),
  MANIFEST_KEY: z.string().default('manifest.json'),
});

export type Env = z.infer<typeof envSchema>;

export type Args = {
  dryRun: boolean;
  force: string | undefined;
  concurrency: number;
};

export type Config = {
  env: Env;
  args: Args;
  photosDir: string;
  repoRoot: string;
};

export const loadConfig = (): Config => {
  const repoRoot = findWorkspaceRoot(import.meta.dirname);
  const envFile = resolve(repoRoot, '.env.local');

  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }

  const env = envSchema.parse(process.env);

  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      'dry-run': { type: 'boolean', default: false },
      force: { type: 'string' },
      concurrency: { type: 'string', default: '4' },
    },
    allowPositionals: true,
  });

  const concurrency = Number(values.concurrency);

  if (!Number.isFinite(concurrency) || concurrency < 1) {
    throw new Error(`invalid --concurrency: ${values.concurrency}`);
  }

  return {
    env,
    args: {
      dryRun: values['dry-run'] ?? false,
      force: values.force,
      concurrency,
    },
    photosDir: resolve(repoRoot, env.PHOTOS_DIR),
    repoRoot,
  };
};

const findWorkspaceRoot = (start: string): string => {
  let dir = start;

  while (dir !== dirname(dir)) {
    if (existsSync(resolve(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }

    dir = dirname(dir);
  }

  throw new Error(`workspace root not found above ${start}`);
};
