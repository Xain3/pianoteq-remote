import type { FastifyInstance } from 'fastify';
import { AppError } from '../errors/AppError.js';

export function registerOriginGuard(server: FastifyInstance) {
  server.addHook('onRequest', async (request, reply) => {
    if (!request.url.startsWith('/api/')) return;
    reply.header('Cache-Control', 'no-store');
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return;
    const origin = request.headers.origin;
    if (!origin) return; // CLI clients have no browser origin.
    try {
      if (new URL(origin).host === request.headers.host) return;
    } catch {
      /* Treat malformed origins as forbidden. */
    }
    throw new AppError('FORBIDDEN_ORIGIN', 'Use the interface served by this host.', 403);
  });
}
