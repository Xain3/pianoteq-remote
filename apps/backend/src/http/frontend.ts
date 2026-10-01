import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import staticPlugin from '@fastify/static';
import type { FastifyInstance } from 'fastify';

export async function registerFrontend(server: FastifyInstance): Promise<void> {
  const root = fileURLToPath(new URL('../../../frontend/dist/', import.meta.url));
  try {
    await access(`${root}/index.html`);
  } catch {
    return;
  }
  await server.register(staticPlugin, { root, wildcard: true });
  server.setNotFoundHandler((request, reply) => {
    const path = request.url.split('?')[0] ?? '';
    const page = request.method === 'GET' && request.headers.accept?.includes('text/html');
    if (page && !path.startsWith('/api/') && !path.includes('.'))
      return reply.sendFile('index.html');
    return reply
      .status(404)
      .send({ error: { code: 'NOT_FOUND', message: 'This resource does not exist.' } });
  });
  server.addHook('onSend', async (request, reply, payload) => {
    if (!request.url.startsWith('/api/')) reply.header('Cache-Control', 'no-cache');
    return payload;
  });
}
