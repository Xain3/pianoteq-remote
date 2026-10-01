import { getVersionIssues, loadVersionFiles } from './version-policy.mjs';

try {
  const issues = getVersionIssues(await loadVersionFiles());
  if (issues.length > 0) {
    console.error(issues.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('SemVer manifests, workspace dependency ranges and package lock agree.');
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Version check failed.');
  process.exitCode = 1;
}
