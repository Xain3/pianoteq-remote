import { readFile } from 'node:fs/promises';
import { parse } from 'dotenv';

export async function loadEnvironment(): Promise<void> {
  const path = new URL('../../../../.env', import.meta.url);
  try {
    const values = parse(await readFile(path));
    for (const [key, value] of Object.entries(values)) process.env[key] ??= value;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}
