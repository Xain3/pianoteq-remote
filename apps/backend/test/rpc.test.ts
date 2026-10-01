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
  await expect(
    new RpcClient('http://localhost', 1000, request).call('getInfo'),
  ).rejects.toMatchObject({ code: 'UPSTREAM_RPC_ERROR', rpcCode: -32601 });
});

test('mismatched response IDs cannot be accepted', async () => {
  const request: typeof fetch = async () =>
    new Response(JSON.stringify({ jsonrpc: '2.0', id: 'other-request', result: {} }));
  await expect(
    new RpcClient('http://localhost', 1000, request).call('getInfo'),
  ).rejects.toMatchObject({ code: 'INVALID_RPC_RESPONSE' });
});

test('slow upstream requests time out', async () => {
  const request: typeof fetch = async (_input, options) => {
    await setTimeout(1000, undefined, { signal: options?.signal ?? undefined });
    return new Response('{}');
  };
  await expect(
    new RpcClient('http://localhost', 20, request).call('getInfo'),
  ).rejects.toMatchObject({ code: 'UPSTREAM_TIMEOUT', statusCode: 504 });
});
