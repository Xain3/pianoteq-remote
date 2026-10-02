import { expect, test } from 'vitest';
import { setTimeout } from 'node:timers/promises';
import { RpcClient } from '../src/rpc/RpcClient.js';

test('JSON-RPC errors on HTTP 200 are rejected', async () => {
  const request: typeof fetch = async (_input, options) => {
    const command = JSON.parse(String(options?.body));
    expect(command.params).toEqual([]);
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: command.id,
        error: { code: -32601, message: 'Method not found' },
      }),
    );
  };
  const rpc = new RpcClient('http://localhost/rpc-error', 1000, request);
  await expect(rpc.call('getInfo')).rejects.toMatchObject({
    code: 'UPSTREAM_RPC_ERROR',
    rpcCode: -32601,
  });
  await rpc.dispose();
});

test('mismatched response IDs cannot be accepted', async () => {
  const request: typeof fetch = async () =>
    new Response(JSON.stringify({ jsonrpc: '2.0', id: 'other-request', result: {} }));
  const rpc = new RpcClient('http://localhost/mismatched-id', 1000, request);
  await expect(rpc.call('getInfo')).rejects.toMatchObject({ code: 'INVALID_RPC_RESPONSE' });
  await rpc.dispose();
});

test('slow upstream requests time out', async () => {
  const request: typeof fetch = async (_input, options) => {
    await setTimeout(1000, undefined, { signal: options?.signal ?? undefined });
    return new Response('{}');
  };
  const rpc = new RpcClient('http://localhost/timeout', 20, request);
  await expect(rpc.call('getInfo')).rejects.toMatchObject({
    code: 'UPSTREAM_TIMEOUT',
    statusCode: 504,
  });
  await rpc.dispose();
});

test('successful RPC responses retain their result', async () => {
  const request: typeof fetch = async (_input, options) => {
    const command = JSON.parse(String(options?.body));
    return new Response(
      JSON.stringify({ jsonrpc: '2.0', id: command.id, result: { version: '8.0' } }),
    );
  };
  const rpc = new RpcClient('http://localhost/success', 1000, request);
  await expect(rpc.call('getInfo')).resolves.toEqual({ version: '8.0' });
  await rpc.dispose();
});

test('calls on one client are serialized in invocation order', async () => {
  let active = 0;
  let maximumActive = 0;
  const methods: string[] = [];
  const request: typeof fetch = async (_input, options) => {
    const command = JSON.parse(String(options?.body));
    active++;
    maximumActive = Math.max(maximumActive, active);
    methods.push(command.method);
    await setTimeout(5);
    active--;
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: command.id, result: command.method }));
  };
  const rpc = new RpcClient('http://localhost/serialized', 1000, request);
  await expect(
    Promise.all([rpc.call('first'), rpc.call('second'), rpc.call('third')]),
  ).resolves.toEqual(['first', 'second', 'third']);
  expect(maximumActive).toBe(1);
  expect(methods).toEqual(['first', 'second', 'third']);
  await rpc.dispose();
});

test('callParallel explicitly allows calls on one client to overlap', async () => {
  let active = 0;
  let maximumActive = 0;
  const request: typeof fetch = async (_input, options) => {
    const command = JSON.parse(String(options?.body));
    active++;
    maximumActive = Math.max(maximumActive, active);
    await setTimeout(5);
    active--;
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: command.id, result: command.method }));
  };
  const rpc = new RpcClient('http://localhost/parallel', 1000, request);
  await expect(
    Promise.all([rpc.callParallel('first'), rpc.callParallel('second')]),
  ).resolves.toEqual(['first', 'second']);
  expect(maximumActive).toBe(2);
  await rpc.dispose();
});

test('only one client can own a Pianoteq session at a time', async () => {
  const url = 'http://localhost/shared-session';
  const first = new RpcClient(url, 1000, fetch);
  expect(() => new RpcClient(url, 1000, fetch)).toThrow(
    expect.objectContaining({ code: 'RPC_SESSION_IN_USE', statusCode: 409 }),
  );
  await first.dispose();
  const replacement = new RpcClient(url, 1000, fetch);
  await replacement.dispose();
});
