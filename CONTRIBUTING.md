# Contributing

Thanks for helping improve Pianoteq Remote. Bug reports and focused pull requests are welcome.

## Getting started

Use Node.js 24 LTS and npm. Install dependencies and start the explicit demo mode:

```sh
npm install
npm run dev:demo
```

Before opening a pull request, run:

```sh
npm run version:check
npm run typecheck
npm test
npm run build
npm run format:check
```

Vitest is the test runner. Place tests near the code they cover, import test functions from
`vitest`, and cover the failure paths and user-visible behavior introduced by a change. Use
representative fixtures instead of claiming that a mock establishes compatibility with live
Pianoteq hardware.

## Code changes

- Keep browser UI, instrument services and shared contracts in their existing package boundaries.
- Validate JSON and user-supplied colour values at their boundaries.
- Keep RPC writes explicit, serialized and covered by focused tests.
- Keep API responses out of service-worker caches and never queue offline instrument commands.
- Describe tested Pianoteq versions and limitations honestly. Hardware device switching is unsupported.
- Do not commit `.env` files, credentials, tokens, or build output.

## Conventional Commits

Write a short, imperative summary in the form `type(scope): summary`, for example:

```text
feat(themes): add editable appearance presets
fix(rpc): preserve the host parameter ID
test(api): cover unavailable Pianoteq responses
docs(readme): explain LAN setup
```

Use `feat`, `fix`, `docs`, `test`, `refactor`, `build`, or `chore` as appropriate. Add a
`BREAKING CHANGE:` footer for an incompatible public API change.

## Versions and releases

This repository uses synchronized SemVer across the root and private npm workspaces. Check
the manifests and lockfile with `npm run version:check`. After committing all work, bump every
workspace together using one of:

```sh
npm run version:bump -- patch
npm run version:bump -- minor
npm run version:bump -- major
```

The bump command requires a clean Git worktree and updates the manifests, internal workspace
dependency ranges and lockfile. Then run the checks above, update `CHANGELOG.md`, commit the
release with `chore(release): vX.Y.Z`, and create the matching annotated `vX.Y.Z` tag.

Before version 1.0.0, breaking changes may be included in a minor release, consistent with
SemVer's initial development rules. After 1.0.0, increment the major version for incompatible
changes, the minor version for compatible features and the patch version for compatible fixes.

## AI-assisted contributions

You may use AI tools, but review their output and run the relevant checks. Contributors are
responsible for the code and documentation they submit and should disclose substantial
AI-generated contributions in the pull request description.
