---
description: "Use when creating, drafting, reviewing, or committing Git commit messages. Follow this repository's Conventional Commits format with optional scope and body."
---

# Commit Message Policy

- Follow the Conventional Commits policy in `CONTRIBUTING.md`.
- Use an imperative `type: summary` or `type(scope): summary` header with an appropriate type. Include a concise scope when it helps identify the affected area.
- A body is optional. Explain the rationale and key details in natural language when the change needs context; no fixed labels or declaration of no breaking changes are required.
- For incompatible changes, mark the header with `!` or add a `BREAKING CHANGE:` footer. Explain the impact and required migration in the body or footer. Do not mark compatible changes as breaking.
- Keep the message faithful to the actual changes; do not claim tests, behavior, or migrations that were not verified.
