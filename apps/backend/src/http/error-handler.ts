import type { FastifyInstance } from 'fastify';
import { AppError } from '../errors/AppError.js';

export function registerErrorHandler(server: FastifyInstance) {
  server.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply
        .status(error.statusCode)
        .send({ error: { code: error.code, message: error.message } });
    }
    const validation = typeof error === 'object' && error !== null && 'validation' in error;
    if (validation) {
      return reply
        .status(400)
        .send({ error: { code: 'INVALID_REQUEST', message: 'Check the supplied values.' } });
    }
    request.log.error(error);
    return reply
      .status(500)
      .send({ error: { code: 'INTERNAL_ERROR', message: 'The request could not be completed.' } });
  });
}
