import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile } from 'node:fs/promises';
import { bumpVersionFiles, loadVersionFiles, projectRoot } from './version-policy.mjs';

const execFile = promisify(execFileCallback);

try {
  const releaseType = process.argv[2];
  if (!releaseType) throw new Error('Usage: npm run version:bump -- <major|minor|patch>');

  const { stdout } = await execFile(
    'git',
    ['-c', `safe.directory=${projectRoot.replaceAll('\\', '/')}`, 'status', '--porcelain'],
    { cwd: projectRoot },
  );
  if (stdout.trim()) {
    throw new Error('Commit or stash all work before bumping the release version.');
  }

  const result = bumpVersionFiles(await loadVersionFiles(), releaseType);
  await Promise.all([
    ...result.manifests.map((manifest) =>
      writeFile(manifest.filePath, `${JSON.stringify(manifest.data, null, 2)}\n`),
    ),
    writeFile(result.lockPath, `${JSON.stringify(result.lockfile, null, 2)}\n`),
  ]);

  console.log(`Updated all package versions from ${result.current} to ${result.next}.`);
  console.log('Run npm run version:check and the project checks, then commit and tag the release.');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Version bump failed.');
  process.exitCode = 1;
}
