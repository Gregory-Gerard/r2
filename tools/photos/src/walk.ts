import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

export type FileEntry = {
  absPath: string;
  relPath: string;
  chapter: string;
  order: number;
};

export const walk = async (root: string): Promise<FileEntry[]> => {
  const out: FileEntry[] = [];
  const dirs = await readdir(root, { withFileTypes: true });

  for (const dir of dirs) {
    if (!dir.isDirectory() || dir.name.startsWith('.')) {
      continue;
    }

    const chapter = slugify(dir.name);

    if (!chapter) {
      continue;
    }

    const subdir = join(root, dir.name);
    const files = await readdir(subdir, { withFileTypes: true });

    for (const f of files) {
      if (!f.isFile()) {
        continue;
      }

      if (!/\.(jpe?g)$/i.test(f.name)) {
        continue;
      }

      const absPath = join(subdir, f.name);
      out.push({
        absPath,
        relPath: nfc(relative(root, absPath)),
        chapter,
        order: parseOrder(f.name),
      });
    }
  }

  return out;
};

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const nfc = (s: string) => s.normalize('NFC');

// Captures the order number from a filename ending in `-<order>.<ext>` or
// `-<order>-<suffix>.<ext>` (e.g. `photo-12.jpg` → 12, `photo-12-2.jpg` → 12).
const ORDER_RE = /-(\d+)(?:-\d+)?\.[^.]+$/;

const parseOrder = (filename: string): number => {
  const m = ORDER_RE.exec(filename);

  if (!m) {
    throw new Error(`cannot extract order from filename: ${filename}`);
  }

  return Number(m[1]);
};
