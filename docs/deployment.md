# Deployment

Pianoteq Remote supports native Node.js and optional Docker deployment. Both serve
the built frontend and API from one process. Pianoteq runs separately on the host;
activate it and configure audio/MIDI in its normal interface first.

## Native Node.js

Use Node.js 24 and npm from the repository root:

```sh
npm ci
npm run build
cp .env.example .env
npm start
```

The default API listens on `127.0.0.1:8787` and connects to Pianoteq at
`http://127.0.0.1:8081/jsonrpc`. See the README for Pianoteq launch commands.
For a demo, run `npm run start:demo`. For LAN access, set `PTQ_API_HOST=0.0.0.0`
in `.env`. An OS service manager can supervise `node apps/backend/dist/index.js`
with the repository as its working directory; service installation is manual.

## Docker demo

Install Docker Engine or Docker Desktop with Docker Compose v2. Run from the
repository root:

```sh
docker compose -f compose.yaml -f compose.demo.yaml up --build -d
```

Open <http://localhost:8787>. Demo mode is explicit and produces no sound.
Stop it using the same file selection:

```sh
docker compose -f compose.yaml -f compose.demo.yaml down
```

## Docker with Pianoteq on Linux

With Pianoteq serving `127.0.0.1:8081`, use the standalone host-network file:

```sh
docker compose -f compose.host.yaml up --build -d
```

This shares the host network so the existing loopback RPC address works without
exposing Pianoteq's RPC listener to the LAN. The web service also binds loopback
by default. To expose only the web service on a trusted LAN:

```sh
PTQ_API_HOST=0.0.0.0 docker compose -f compose.host.yaml up --build -d
```

Stop with `docker compose -f compose.host.yaml down`. Do not merge this file with
`compose.yaml`, which publishes ports for bridge networking. Host networking
reduces network isolation. This example targets Linux Docker Engine; Docker Desktop
host networking requires an explicit opt-in and platform verification.

## Docker bridge networking

For Docker Desktop or a reachable external Pianoteq host:

```sh
PTQ_RPC_URL=http://host.docker.internal:8081/jsonrpc docker compose up --build -d
```

`host.docker.internal` routes to the host, with a `host-gateway` mapping supplied
for Linux. A host service bound only to loopback may not be reachable this way;
verify connectivity on your platform. On Linux, prefer the host-network example
for local Pianoteq. For a separate instrument host, supply its reachable RPC URL.
Keep RPC access restricted to the companion service's network path.

The explicit URL above overrides a native `.env` file's loopback URL. Compose reads
`.env` for interpolation, but does not mount or copy it into the image. Real mode
is fixed in the real configurations; select the demo override explicitly.

The bridge configuration listens on all interfaces inside the container but publishes
only `127.0.0.1:8787` on the host. For trusted LAN access:

```sh
PTQ_PUBLISH_HOST=0.0.0.0 PTQ_RPC_URL=http://host.docker.internal:8081/jsonrpc docker compose up --build -d
```

`PTQ_PUBLISH_PORT` changes the bridge host port. `PTQ_API_HOST` and `PTQ_API_PORT`
control the host-network deployment. `PTQ_RPC_URL` and `PTQ_RPC_TIMEOUT_MS` apply
to both real deployments. Run only one configuration on a given port at a time.

## Operation and updates

The multi-stage image includes compiled code, frontend assets and production
dependencies, runs as the `node` user, and needs no persistent volume or hardware
device mounts. Compose uses a read-only filesystem, an init process and automatic
restart unless stopped. Pianoteq installation, activation and startup remain separate.

Use `docker compose logs -f remote` and `docker compose ps` to inspect the bridge
deployment; include the same `-f` arguments when using another configuration.
The image health check tests `/api/health`, which reports web-service liveness,
not Pianoteq connectivity or hardware compatibility. An unhealthy status alone
does not trigger Compose's restart policy.

After updating the checkout, rerun the appropriate `up --build -d` command.
This recreates the service and can interrupt commands, so update when idle.
PWA users still explicitly accept frontend updates.

The API has no authentication. Use a trusted network and an HTTPS reverse proxy
that preserves the public Host header for installable phone/PWA access. Docker
does not configure certificates or authentication.

See Docker's [host networking documentation](https://docs.docker.com/engine/network/drivers/host/)
and [Desktop networking documentation](https://docs.docker.com/desktop/features/networking/networking-how-tos/)
for platform-specific details. Demo and container startup checks do not establish
live Pianoteq or audio/MIDI compatibility.

## Validation

The deployment addition passed native typechecking, all 23 Vitest tests, the native
production build, version checks, and all three Compose configuration and build
checks, including a clean image build without cached build steps.

On Docker Desktop, temporary Compose demo and real-mode bridge containers became
healthy and served the API, frontend assets, manifest and service worker through
their published localhost ports. Demo volume writes persisted across reads and
invalid volume input was rejected. Real mode returned `503 PIANOTEQ_UNAVAILABLE`
for a deliberately unreachable RPC endpoint. The containers ran as the `node`
user with read-only filesystems and the configured capability restrictions.

The host-network configuration built and became healthy; its API and assets passed
checks inside the container. Its localhost port was unreachable from the physical
host in this Docker Desktop setup, so host-network access remains unverified end
to end. Live Pianoteq connectivity, audio/MIDI hardware and Linux Docker Engine
host networking were not tested.

The changed Markdown and YAML files passed formatting; the repository format check
reports existing issues in four `.github` instruction files.
