# Pianoteq Remote

A small responsive React/TypeScript PWA with a Node/Fastify companion service.
Built as an editable MVP scaffold for preset switching, volume, and audio/MIDI settings.

## Quick start

Requires Node.js 24 LTS (or another version accepted by `package.json`) and npm. From this folder:

```sh
npm install
npm run dev:demo
```

Open **http://localhost:5173**. Demo mode is explicitly labelled and simulates preset
and volume changes. It does not connect to Pianoteq or produce sound.

## Connect to Pianoteq

Copy `.env.example` to `.env` and keep `PTQ_MODE=real`. Enable the standalone
Pianoteq API on the host computer, adapting the executable name/path to your edition:

```sh
# Linux example
"./Pianoteq 9" --headless --serve 127.0.0.1:8081
```

```powershell
# Windows example; use your actual executable path
& 'C:\path\to\Pianoteq 9.exe' --headless --serve 127.0.0.1:8081
```

```sh
# macOS example; use your actual app bundle and executable path
"/Applications/Pianoteq 9/Pianoteq 9.app/Contents/MacOS/Pianoteq 9" --headless --serve 127.0.0.1:8081
```

Activate Pianoteq and configure its audio/MIDI devices in its normal interface first.
Run `npm run dev` and open http://localhost:5173. Change `PTQ_RPC_URL` in `.env` if needed.
The host does not silently fall back to demo mode when Pianoteq is unavailable.

## MVP coverage

- Preset browsing/search and switching using both name and bank.
- Master volume using a discovered parameter ID, compatible in shape with pre-v9 and v9 IDs.
- Current audio driver, output, sample rate and buffer size, plus available outputs.
- Audio and MIDI selectors that explicitly show their unavailable/read-only status.
- Responsive desktop and phone layouts; keyboard-accessible volume and preset controls.
- Production PWA manifest, asset caching and an update prompt. No cached API state or offline writes.

**Hardware device switching and MIDI device enumeration are not verified through the Pianoteq API.**
They are deliberately unsupported in this adapter. Configure devices in Pianoteq; the scaffold
provides a gateway boundary for a future supported implementation. It never edits `.prefs` files.

## Production / phone access

```sh
npm run build
npm start
# Or preview the complete built app without Pianoteq:
npm run start:demo
```

Fastify serves both the built interface and the API at **http://localhost:8787**.
Set `PTQ_API_HOST=0.0.0.0` in `.env` for your LAN, then visit `http://HOST-IP:8787`
from a phone. The API has no user authentication: use it on a trusted network.

Installable PWA behaviour on a phone generally requires trusted HTTPS, even on a LAN.
Use an HTTPS reverse proxy that preserves the public Host header in front of port 8787,
or choose an equivalent trusted local deployment. On the host computer, localhost is
an accepted development exception. The service worker is enabled in production builds,
not during `npm run dev`. The server must remain reachable for instrument control.

## Project map

```text
apps/frontend/     React feature modules, hooks, API client, CSS and PWA assets
apps/backend/      Fastify routes, config, RPC adapter and demo provider
packages/shared/   Browser-safe schemas, contracts, interfaces and pure helpers
docs/              Architecture and upstream API coverage
.agents/skills/    Project-local Pianoteq integration skill
scripts/           Icon generation and SemVer validation/bumping
AGENTS.md          Instructions for future changes
```

See [architecture](docs/architecture.md) and [API coverage](docs/pianoteq-api.md).
The project-local skill travels with this repository; no global skill is installed.

## Development checks

```sh
npm run typecheck
npm run version:check
npm test
npm run test:watch
npm run build
npm run format:check
```

Vitest runs the TypeScript tests directly; `npm test` runs once and `npm run test:watch`
keeps watching. Shared imports resolve to source in tests, so no prebuild is required.
`npm run version:check` validates every package version, internal range and lockfile entry.
Focused backend tests cover RPC errors/timeouts, old/new volume IDs, preset bank identity,
command recovery, input validation and unsupported device writes. These checks do not
establish compatibility with a real Pianoteq 9 host or connected audio/MIDI hardware.
See [validation notes](docs/validation.md) for the scaffold's completed checks and limits.

File operations use `node:fs/promises`. The service has no heavy synchronous request work,
no database requirement, no audio processing and no runtime dependency on Python or Go.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, checks,
code conventions, Conventional Commit messages and the release process.

## AI-assisted development

Generative AI tools assisted with code, tests, theme development and documentation in this
project. AI output can be incorrect or incomplete. Maintainers review contributions, but
the software is provided under the MIT License without a guarantee of correctness. Verify
changes before relying on them, especially against a real Pianoteq installation.
