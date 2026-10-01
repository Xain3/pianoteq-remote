import { PresetIdentity, type InstrumentSnapshot } from '@ptq/shared';
import { z } from 'zod';
import { RpcClient } from '../rpc/RpcClient.js';
import { UpstreamParser } from '../rpc/UpstreamParser.js';
import { ParameterService } from './ParameterService.js';
import { PresetService } from './PresetService.js';

const infoSchema = z.object({
  product_name: z.string().default('Pianoteq'),
  version: z.string().default('Unknown'),
  current_preset: z.object({ name: z.string(), bank: z.string().optional() }),
});

export class SnapshotService {
  constructor(
    private readonly rpc: RpcClient,
    private readonly parameters: ParameterService,
    private readonly presets: PresetService,
  ) {}

  async read(): Promise<InstrumentSnapshot> {
    const [raw, volume, presets] = await Promise.all([
      this.rpc.call('getInfo'),
      this.parameters.volume(),
      this.presets.list(),
    ]);
    const info = UpstreamParser.parse(infoSchema, UpstreamParser.first(raw), 'getInfo');
    return {
      mode: 'real',
      product: info.product_name,
      version: info.version,
      currentPresetName: info.current_preset.name,
      currentPreset: PresetIdentity.resolve(
        presets,
        info.current_preset.name,
        info.current_preset.bank,
      ),
      volume,
      capturedAt: new Date().toISOString(),
    };
  }
}
