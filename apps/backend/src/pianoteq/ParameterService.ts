import { ParameterIds, type InstrumentSnapshot } from '@ptq/shared';
import { z } from 'zod';
import { AppError } from '../errors/AppError.js';
import { RpcClient } from '../rpc/RpcClient.js';
import { UpstreamParser } from '../rpc/UpstreamParser.js';

const parametersSchema = z.array(
  z.object({
    id: z.string(),
    text: z.string().default(''),
    normalized_value: z.number().min(0).max(1).optional(),
  }),
);

export class ParameterService {
  constructor(private readonly rpc: RpcClient) {}

  private async list() {
    return UpstreamParser.parse(
      parametersSchema,
      await this.rpc.call('getParameters'),
      'getParameters',
    );
  }

  async volume(): Promise<InstrumentSnapshot['volume']> {
    const volume = ParameterIds.find(await this.list(), 'volume');
    if (volume?.normalized_value === undefined) return null;
    return { normalized: volume.normalized_value, text: volume.text };
  }

  async setVolume(normalized: number): Promise<void> {
    const volume = ParameterIds.find(await this.list(), 'volume');
    if (!volume)
      throw new AppError(
        'UNSUPPORTED_CAPABILITY',
        'This Pianoteq instance does not expose volume control.',
        501,
      );
    await this.rpc.call('setParameters', {
      list: [{ id: volume.id, normalized_value: normalized }],
    });
  }
}
