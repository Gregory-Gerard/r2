import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

export const hashFile = async (path: string): Promise<string> => {
  const data = await readFile(path);

  return createHash('sha256').update(data).digest('hex').slice(0, 12);
};
