---
name: pianoteq-api
description: Maintain Pianoteq JSON-RPC integration, parameter compatibility, preset identity, and device capability reporting in Pianoteq Remote. Use when changing the instrument adapter or adding remote controls.
---

# Pianoteq API integration

Read `docs/pianoteq-api.md` at the project root for the verified surface and source links. Keep upstream RPC details in `apps/backend/src/pianoteq` and `apps/backend/src/rpc`; the frontend consumes the shared application contract.

For a new control, inspect the running instance's API reference at its configured JSON-RPC address when available. Record the method, argument shape, response shape and observed version. Add the method only after confirming its existence; older forum examples do not prove current support.

Use `getParameters` to discover IDs. Match normalized names with `ParameterIds.find`, then send the returned original ID. Do not persist numeric parameter indices. Support missing parameters as unavailable controls.

Identify presets by bank and name using `PresetIdentity`. An old `getInfo` response may prefix custom names with the bank. Avoid guessing when multiple banks contain the same display name.

Include `params` on every RPC call, check JSON-RPC errors separately from HTTP status, and enforce timeouts. Re-read confirmed state after writes. Never retry non-idempotent commands blindly or queue them for offline replay.

Device selection currently has no verified write method in this scaffold. Report explicit capabilities and show disabled controls with a useful explanation. If the runtime exposes a device write method, add it through the gateway contract, verify its response, and update capability flags and documentation together.

Use Vitest fixture tests for response variants and failure paths when tests are requested, then state separately whether a live Pianoteq instance was exercised. Demo mode must stay a visibly labelled simulation.
