# Scaffold validation

Checked on Windows with Node.js 24.12.0.

## ESLint and TypeScript 7

`typescript-eslint` currently needs the TypeScript 6 compiler API. The root `typescript` dependency is therefore aliased to `@typescript/typescript6` for linting, while `@typescript/native` keeps the TypeScript 7 compiler available to project builds. This is temporary: once `typescript-eslint` supports the installed TypeScript 7 version, remove the aliases, restore the regular TypeScript 7 dependency, and rerun `npm run lint` and `npm run typecheck`.

- Vitest covers RPC/API behavior, shared contracts, theme colour math and storage, and SemVer release rules.
- TypeScript: frontend, backend, shared code and test sources passed strict type checking.
- Production build: frontend assets, PWA manifest and service worker generated successfully.
- Formatting: Prettier checks passed.
- Development startup: shared watch build, API and Vite started successfully.
- Browser demo: preset switching, volume changes and preset search worked. Audio and MIDI selectors were disabled with explanations.
- Responsive layout: checked desktop, tablet and phone widths, including 320 px. The small-screen overflow found during inspection was fixed.
- PWA update: the built app showed an update prompt, and applying it loaded the new interface.
- Project-local integration skill: passed the skill format validator.
- Release policy: synchronized version and lockfile check passed for the current `0.1.0` release.

The checks used demo mode and injected RPC fixtures. A live Pianoteq 9 instance,
actual audio/MIDI devices and installation on a physical phone have not been exercised.
Device switching remains unsupported. This scaffold does not install an OS service.
