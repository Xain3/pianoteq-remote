# Architecture

```text
Browser / installed PWA
  React feature components -> hooks -> PianoteqApi -> /api/*
                                                   |
Node / Fastify                                     |
  routes -> InstrumentGateway --------------------+
              |                   |
       PianoteqGateway        DemoGateway (explicit simulation)
              |
  PresetService / ParameterService / DeviceService / SnapshotService
              |
          RpcClient -> Pianoteq JSON-RPC on localhost:8081
```

`packages/shared` provides schemas, TypeScript types, the gateway interface, and pure
identity helpers. There are no Node imports in that package. Public HTTP contracts
are validated using the same schemas as the frontend. Vendor response validation is
backend-specific so browser components do not depend on Pianoteq's raw field names.

The frontend and API share an origin. Vite proxies `/api` during development;
Fastify serves the built frontend in production. No public-site-to-LAN calls are needed.
The backend destination is configured locally, not supplied by arbitrary browser requests.
Its API exposes specific application operations, not an unrestricted RPC proxy.

Parameter IDs are discovered, preset identity includes the bank, commands are serialized
with a bounded queue, and the controller re-reads state after a write. The frontend
refreshes the snapshot every five seconds while visible and idle. Catalog and audio
queries have separate refreshes. Late reads cannot overwrite an acknowledged mutation.
Slider changes update locally; pointer release, keyboard release or blur submits the value.

The PWA precaches interface assets only. API requests use `no-store`; there is no background
sync or offline mutation queue. Updates prompt the user. The installed app still requires
a reachable companion service and Pianoteq for real control. HTTPS on LAN clients needs
a deployment choice (e.g. a trusted HTTPS reverse proxy); localhost alone only works on
the device actually running the server.

The service never launches Pianoteq or changes audio routing. Its process has no place
in the MIDI-to-audio path. Node is a runtime dependency; standalone installers, OS service
registration, remote authentication, HTTPS certificate provisioning and distribution
packaging are future work, not included in the MVP scaffold.
