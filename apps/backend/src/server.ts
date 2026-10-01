import type { InstrumentGateway } from '@ptq/shared';
import Fastify from 'fastify';
import { registerErrorHandler } from './http/error-handler.js';
import { registerFrontend } from './http/frontend.js';
import { registerOriginGuard } from './http/origin-guard.js';
import { registerRoutes } from './http/routes.js';

export async function createServer(
  gateway: InstrumentGateway,
  productionAssets = true,
  logging = true,
) {
  const server = Fastify({
    logger: logging,
    bodyLimit: 16384,
    ajv: { customOptions: { coerceTypes: false } },
  });
  registerErrorHandler(server);
  registerOriginGuard(server);
  registerRoutes(server, gateway);
  if (productionAssets) await registerFrontend(server);
  return server;
}
