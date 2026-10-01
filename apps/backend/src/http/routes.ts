import {
  presetSelectionSchema,
  volumeCommandSchema,
  type InstrumentGateway,
  type PresetSelection,
  type VolumeCommand,
} from '@ptq/shared';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AppError } from '../errors/AppError.js';

export function registerRoutes(server: FastifyInstance, gateway: InstrumentGateway) {
  server.get('/api/health', async () => ({ status: 'ok' }));
  server.get('/api/snapshot', () => gateway.getSnapshot());
  server.get('/api/presets', () => gateway.getPresets());
  server.get('/api/devices', () => gateway.getIoSettings());

  server.post<{ Body: PresetSelection }>(
    '/api/presets/load',
    {
      schema: { body: z.toJSONSchema(presetSelectionSchema, { target: 'draft-7' }) },
    },
    (request) => gateway.loadPreset(request.body),
  );

  server.patch<{ Body: VolumeCommand }>(
    '/api/volume',
    {
      schema: { body: z.toJSONSchema(volumeCommandSchema, { target: 'draft-7' }) },
    },
    (request) => gateway.setVolume(request.body.normalized),
  );

  for (const device of ['audio', 'midi']) {
    server.patch(`/api/devices/${device}`, async () => {
      throw new AppError(
        'UNSUPPORTED_CAPABILITY',
        'Device switching is not supported. Configure it in Pianoteq.',
        501,
      );
    });
  }
}
