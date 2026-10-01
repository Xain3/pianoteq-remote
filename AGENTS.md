# Pianoteq Remote project instructions

This project is a responsive React/TypeScript PWA with a Node/Fastify host service.

## Structure and implementation

- `apps/frontend`: browser code and UI features. No filesystem or direct Pianoteq RPC access.
- `apps/backend`: HTTP routes, runtime configuration, RPC client, and instrument adapters.
- `packages/shared`: browser-safe contracts, runtime schemas, interfaces, and pure helpers.
- Keep helpers focused on one responsibility. Use wrapper files to compose them. Split files when they accumulate unrelated work; use static classes for stateless namespaces when clearer than functions.
- Use TypeScript strict mode. Validate external data at the boundary; compile-time types alone do not validate JSON.
- Use asynchronous filesystem APIs and asynchronous network calls. Keep CPU-heavy work out of request handlers.
- Keep instance state in injected services; do not hide mutable connection state in static singletons.
- Both frontends and backends import the shared public entry point, not one another's source files.

## Instrument behaviour

- Send JSON-RPC `params` even for no-argument calls. Match response IDs and check RPC error envelopes on HTTP 200.
- Read parameter IDs from Pianoteq. Match through `ParameterIds`, and send the exact original ID. Parameter indices are not stable.
- Identify presets with both name and bank. Keep display names separate from IDs.
- Demo mode is explicitly selected and clearly displayed; never substitute simulated success when real mode fails.
- Device switching is unsupported until confirmed on a real runtime or vendor documentation. Expose the limitation and preserve the adapter boundary. Do not rewrite live `.prefs` files as a shortcut.
- Read [the Pianoteq API skill](.agents/skills/pianoteq-api/SKILL.md) when changing RPC methods or compatibility.

## Interface and checks

- Support phones and computers, keyboard interaction, readable touch targets, and reduced motion. Keep UI state responsive while requests are pending.
- Never cache API responses or replay offline commands in the service worker. Updates require an explicit action and should not interrupt an active command.
- Keep polling light, pause it in hidden tabs, and prevent late reads from overwriting successful mutations.
- Keep theme input on the validated six-digit hex format. Treat local storage as untrusted input and validate it on read.
- Use Vitest for automated tests with explicit imports from `vitest`. Keep tests with their owning package and register new test environments in the root configuration when needed.
- Run `npm run version:check` when editing package manifests, dependencies or the lockfile. Keep the root and workspace SemVer versions synchronized.
- When asked to verify changes, run `npm run typecheck`, `npm test`, and `npm run build`. Add focused regression tests when requested for behaviour that can fail: RPC parsing, ID compatibility, preset identity, command ordering and routes.
- Document validation accurately. Demo tests and mock RPC fixtures do not establish live Pianoteq or hardware compatibility.
