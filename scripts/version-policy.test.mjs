import { describe, expect, it } from 'vitest';
import { bumpVersionFiles, getVersionIssues, nextVersion } from './version-policy.mjs';

function versionState(version = '0.1.0') {
  const manifests = [
    { path: '', data: { name: 'pianoteq-remote', version } },
    {
      path: 'apps/frontend',
      data: { name: '@ptq/frontend', version, dependencies: { '@ptq/shared': version } },
    },
    { path: 'packages/shared', data: { name: '@ptq/shared', version } },
  ];
  const lockfile = {
    packages: {
      '': { version },
      'apps/frontend': { version, dependencies: { '@ptq/shared': version } },
      'packages/shared': { version },
    },
  };
  return { manifests, lockfile };
}

describe('SemVer workspace releases', () => {
  it('accepts stable and pre-release SemVer versions', () => {
    expect(getVersionIssues(versionState('1.2.3'))).toEqual([]);
    expect(getVersionIssues(versionState('1.2.3-rc.1+build.7'))).toEqual([]);
  });

  it('rejects leading zeros that SemVer disallows', () => {
    expect(getVersionIssues(versionState('01.2.3')).join('\n')).toContain('valid SemVer');
  });

  it('computes patch, minor and major release versions', () => {
    expect(nextVersion('0.1.0', 'patch')).toBe('0.1.1');
    expect(nextVersion('0.1.0', 'minor')).toBe('0.2.0');
    expect(nextVersion('0.1.0', 'major')).toBe('1.0.0');
    expect(nextVersion('1.0.0-rc.1', 'patch')).toBe('1.0.0');
  });

  it('bumps every manifest, internal dependency range and lockfile together', () => {
    const state = versionState();
    state.manifests[1].data.dependencies['@ptq/shared'] = '^0.1.0';
    state.lockfile.packages['apps/frontend'].dependencies['@ptq/shared'] = '^0.1.0';
    const bumped = bumpVersionFiles(state, 'minor');

    expect(bumped.next).toBe('0.2.0');
    expect(bumped.manifests.every((manifest) => manifest.data.version === '0.2.0')).toBe(true);
    expect(bumped.manifests[1]?.data.dependencies?.['@ptq/shared']).toBe('^0.2.0');
    expect(getVersionIssues(bumped)).toEqual([]);
  });

  it('reports workspace ranges that exclude the shared package version', () => {
    const state = versionState();
    state.manifests[1].data.dependencies['@ptq/shared'] = '^0.2.0';
    expect(getVersionIssues(state).join('\n')).toContain('does not accept 0.1.0');
  });
});
