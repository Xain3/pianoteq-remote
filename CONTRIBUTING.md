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

`npm install` configures a local `commit-msg` hook that checks new commits. Run
`npm run commitlint:check` to check the latest commit manually. The hook and command enforce
Conventional Commit syntax and the accepted types.

Start with a short, imperative summary in the form `type: summary` or `type(scope): summary`.
Scope is optional; include it when it helps identify the affected area. Use `feat`, `fix`,
`docs`, `test`, `refactor`, `build`, or `chore` as appropriate. A small change can use just a
header:

```text
docs: correct demo startup instructions
```

A body is optional. Add a natural-language explanation when the rationale or behavior needs
context; no fixed labels or declaration of no breaking changes are required. For example:

```text
fix(settings): preserve saved theme on startup

Startup defaults were overwriting the user's saved selection.
Apply defaults only when no valid saved theme exists.
```

For an incompatible change, mark the header with `!` or add a `BREAKING CHANGE:` footer.
Explain the impact and any required migration in the body or footer. Authors are responsible
for identifying incompatible changes; commitlint validates syntax, not compatibility.

## Pull request checks

GitHub Actions runs project validation on pull requests and pushes to `main`: version
consistency, formatting, type checking, tests, and the production build. The separate
`PR title` check validates titles against the base branch's commitlint policy, including
optional scope and no required body. It reruns when the title changes or new commits arrive.
Use `!` in the title for breaking changes and explain the impact and migration in the PR body.

Repository administrators should configure a branch ruleset for `main` that requires pull
requests and the `Project validation` and `PR title` status checks. Workflow files alone do
not enforce merge requirements. Select the checks after their first runs. If using squash
merges, configure the default squash commit title to use the PR title.

The title workflow uses `pull_request_target` and checks out only the trusted base commit.
It reads the PR title as data and runs no PR code. Keep it separate from project validation;
do not add PR-head checkout, shared caches, or PR-code execution to that workflow.
These checks do not establish live Pianoteq or hardware compatibility.

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
