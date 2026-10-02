---
description: 'Use when changing Pianoteq RPC integration, response parsing, or shared instrument contracts. Preserve backward compatibility from Pianoteq 7.5 through all 8.x releases.'
applyTo:
  - 'apps/backend/src/pianoteq/**/*.ts'
  - 'apps/backend/src/rpc/**/*.ts'
  - 'packages/shared/src/**/*.ts'
---

# Pianoteq Version Compatibility

- Treat Pianoteq 7.5 through all 8.x releases as the compatibility target, not as a claim of live verification.
- Preserve existing behavior for older supported response shapes when adding or changing parsing. Do not assume a method, field, or response shape exists across all target versions without evidence.
- Handle version-dependent or missing capabilities explicitly. Report unavailable behavior instead of silently skipping a command or simulating success.
- Add or update focused fixtures for each relevant response variant when changing version-sensitive behavior. Keep mock coverage distinct from live-version verification.
- Base compatibility claims on the installed runtime API reference or verified documentation. Update `docs/pianoteq-api.md` when confirmed version differences change the supported surface.
- Follow `.agents/skills/pianoteq-api/SKILL.md` for RPC, parameter-ID, and preset-identity rules; do not duplicate or weaken those requirements here.
