---
name: git-commit
description: 'Inspect staged Git changes, draft and validate a Conventional Commit message, and create a commit when explicitly requested. Use for commit preparation, commit-message writing or review, and Git commit tasks in this repository.'
argument-hint: 'Describe the change or ask me to prepare, review, or create a commit.'
---

# Git Commit Workflow

Use this skill to prepare or create commits that follow this repository's policy in `CONTRIBUTING.md` and `.github/instructions/commit-message.instructions.md`.

## Procedure

1. Establish the requested outcome. Drafting or reviewing a message does not authorize creating a commit. Create a commit only when the user explicitly asks for one.
2. Inspect the worktree and index with `git status --short`. Review the staged summary and full staged diff with `git diff --cached --stat` and `git diff --cached`. Use `git diff --cached --check` to detect whitespace errors.
3. Confirm the staged changes form the intended commit. If nothing is staged, do not stage files automatically. If the staged diff combines unrelated work or includes changes that appear unintended, explain what is staged and ask how to proceed.
4. Check the staged diff for secrets, credentials, `.env` files, build output, or other content that should not be committed. Do not commit sensitive content; tell the user what needs attention without reproducing secret values.
5. Choose an accurate type from the changes. Use one of the repository's accepted types (`feat`, `fix`, `docs`, `test`, `refactor`, `build`, or `chore`) and an imperative `type: summary` or `type(scope): summary` header. Scope is optional; include a concise scope when it helps identify the affected area.
6. Add an optional natural-language body when the rationale or key details need context. No fixed labels or declaration of no breaking changes are required. Assess compatibility; for an incompatible change, mark the header with `!` or add a `BREAKING CHANGE:` footer, and explain the impact and migration steps in the body or footer. Never invent rationale, behavior, validation, or migration details; ask the user if important facts cannot be determined from the diff and context.
7. Validate the proposed message with `printf '%s\n' '<message>' | npx --no -- commitlint`. Fix any reported violations before presenting or using it.
8. Show the proposed message. If the user asked only to draft or review, stop after presenting it and any findings. If the user explicitly asked to create the commit, commit only the staged changes using the approved message.
9. Do not stage or unstage files, amend commits, rewrite history, switch branches, or discard changes unless the user explicitly requests that operation. Do not include unstaged changes in the commit.
10. After creating a commit, verify the new commit message and summary and inspect `git status --short`. Report the commit identifier, message, and whether other staged or unstaged changes remain. Do not claim tests were run unless they were.

## Message Shape

For a small change, a header is sufficient:

```text
docs: correct demo startup instructions
```

Include a scope and body when they help explain the change:

```text
fix(settings): preserve saved theme on startup

Startup defaults were overwriting the user's saved selection.
Apply defaults only when no valid saved theme exists.
```

For an incompatible change, use `!` in the header or a standard footer, with impact and
migration guidance in the body or footer:

```text
BREAKING CHANGE: <impact and migration steps>
```
