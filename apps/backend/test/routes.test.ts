import { expect, test } from 'vitest';
import { DemoGateway } from '../src/demo/DemoGateway.js';
import { createServer } from '../src/server.js';

test('API validates mutations, rejects foreign browser origins and reports unsupported devices', async (context) => {
  const server = await createServer(new DemoGateway(), false, false);
  context.onTestFinished(() => server.close());
  const invalid = await server.inject({
    method: 'PATCH',
    url: '/api/volume',
    payload: { normalized: 2 },
  });
  expect(invalid.statusCode).toBe(400);
  const valid = await server.inject({
    method: 'PATCH',
    url: '/api/volume',
    payload: { normalized: 0.3 },
  });
  expect(valid.statusCode).toBe(200);
  expect(valid.json().volume.normalized).toBe(0.3);
  expect(valid.headers['cache-control']).toBe('no-store');
  const foreign = await server.inject({
    method: 'PATCH',
    url: '/api/volume',
    headers: { origin: 'https://other.example' },
    payload: { normalized: 0.2 },
  });
  expect(foreign.statusCode).toBe(403);
  const devices = await server.inject({ method: 'PATCH', url: '/api/devices/audio', payload: {} });
  expect(devices.statusCode).toBe(501);
  expect(devices.json().error.code).toBe('UNSUPPORTED_CAPABILITY');
});
