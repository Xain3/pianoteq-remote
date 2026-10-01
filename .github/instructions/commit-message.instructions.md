---
description: "Use when creating, drafting, reviewing, or committing Git commit messages. Follow this repository's Conventional Commits format and include rationale, change details, and breaking-change status."
---
# Commit Message Policy

- Follow the Conventional Commits policy in `CONTRIBUTING.md`.
- Use an imperative `type(scope): summary` header with an appropriate type and concise scope.
- Include a body explaining why the change was made and the key details of what changed.
- State `Breaking changes: None` when there are no incompatible changes.
- For incompatible changes, end with a `BREAKING CHANGE:` footer describing the impact and required migration. Do not use that footer for compatible changes.
- Keep the message faithful to the actual changes; do not claim tests, behavior, or migrations that were not verified.