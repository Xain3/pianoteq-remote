import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import semver from 'semver';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function canonicalVersion(version) {
  const parsed = semver.parse(version);
  if (!parsed) return null;
  return `${parsed.version}${parsed.build.length > 0 ? `+${parsed.build.join('.')}` : ''}`;
}
export async function loadVersionFiles() {
  const rootManifestPath = join(projectRoot, 'package.json');
  const rootManifest = JSON.parse(await readFile(rootManifestPath, 'utf8'));
  const manifests = [{ path: '', filePath: rootManifestPath, data: rootManifest }];

  for (const pattern of rootManifest.workspaces ?? []) {
    const separator = pattern.indexOf('*');
    if (separator < 0 || pattern.slice(separator + 1).includes('*')) {
      throw new Error(`Version check supports one-level workspace patterns, got: ${pattern}`);
    }
    const prefix = pattern.slice(0, separator).replace(/[\\/]$/, '');
    const basePath = join(projectRoot, prefix);
    const entries = await readdir(basePath, { withFileTypes: true });
    for (const entry of entries.filter((candidate) => candidate.isDirectory())) {
      const manifestPath = join(basePath, entry.name, 'package.json');
      const relativePath = resolve(dirname(manifestPath))
        .slice(projectRoot.length + 1)
        .split(sep)
        .join('/');
      const data = JSON.parse(await readFile(manifestPath, 'utf8'));
      manifests.push({ path: relativePath, filePath: manifestPath, data });
    }
  }

  const lockPath = join(projectRoot, 'package-lock.json');
  const lockfile = JSON.parse(await readFile(lockPath, 'utf8'));
  return { manifests, lockPath, lockfile };
}

export function getVersionIssues({ manifests, lockfile }) {
  const issues = [];
  const root = manifests.find((manifest) => manifest.path === '');
  if (!root) return ['The root package manifest is missing.'];

  const releaseVersion = canonicalVersion(root.data.version);
  if (!releaseVersion || releaseVersion !== root.data.version) {
    issues.push(`Root version must be a valid SemVer version: ${root.data.version}`);
  }

  const workspaceNames = new Map();
  for (const manifest of manifests) {
    const { name, version } = manifest.data;
    const validVersion = canonicalVersion(version);
    if (!name) issues.push(`${manifest.path || '.'}/package.json is missing a package name.`);
    if (!validVersion || validVersion !== version) {
      issues.push(`${name ?? manifest.path}: version must be a valid SemVer version (${version}).`);
    }
    if (releaseVersion && validVersion && validVersion !== releaseVersion) {
      issues.push(`${name}: expected synchronized version ${releaseVersion}, got ${validVersion}.`);
    }
    if (name) workspaceNames.set(name, version);

    const lockKey = manifest.path;
    const lockedVersion = lockfile.packages?.[lockKey]?.version;
    if (lockedVersion !== version) {
      issues.push(
        `${name ?? lockKey}: package-lock.json has version ${lockedVersion ?? 'missing'}; expected ${version}.`,
      );
    }
  }

  for (const manifest of manifests) {
    for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
      for (const [dependency, range] of Object.entries(manifest.data[section] ?? {})) {
        const workspaceVersion = workspaceNames.get(dependency);
        if (!workspaceVersion) continue;
        const validRange = semver.validRange(range);
        if (!validRange || !semver.satisfies(workspaceVersion, validRange)) {
          issues.push(
            `${manifest.data.name} needs ${dependency}@${range}, which does not accept ${workspaceVersion}.`,
          );
        }
      }
    }
  }

  return issues;
}

export function nextVersion(current, releaseType) {
  if (!['major', 'minor', 'patch'].includes(releaseType)) {
    throw new Error('Choose one SemVer increment: major, minor, or patch.');
  }
  const next = semver.inc(current, releaseType);
  if (!next) throw new Error(`Cannot increment invalid SemVer version: ${current}`);
  return next;
}

export function bumpVersionFiles(state, releaseType) {
  const issues = getVersionIssues(state);
  if (issues.length > 0) throw new Error(issues.join('\n'));

  const root = state.manifests.find((manifest) => manifest.path === '');
  const current = root.data.version;
  const next = nextVersion(current, releaseType);
  const workspaceNames = new Set(state.manifests.map((manifest) => manifest.data.name));
  const updated = structuredClone(state);

  for (const manifest of updated.manifests) {
    manifest.data.version = next;
    const lockEntry = updated.lockfile.packages[manifest.path];
    lockEntry.version = next;

    for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
      for (const dependency of workspaceNames) {
        const oldRange = manifest.data[section]?.[dependency];
        if (!oldRange) continue;
        const prefix = ['^', '~'].find((marker) => oldRange.startsWith(marker)) ?? '';
        manifest.data[section][dependency] = prefix + next;
        const lockedRange = lockEntry[section]?.[dependency];
        if (lockedRange) lockEntry[section][dependency] = prefix + next;
      }
    }
  }

  return { ...updated, current, next };
}
