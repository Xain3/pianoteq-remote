import { PresetIdentity, type Preset, type PresetSelection } from '@ptq/shared';
import { z } from 'zod';
import { AppError } from '../errors/AppError.js';
import { RpcClient } from '../rpc/RpcClient.js';
import { UpstreamParser } from '../rpc/UpstreamParser.js';

const presetsSchema = z.array(
  z.object({
    name: z.string(),
    bank: z.string().default(''),
    instrument: z.string().default(''),
    license_status: z.string().default('unknown'),
  }),
);

export class PresetService {
  private cached: Preset[] | undefined;
  private expiresAt = 0;

  constructor(private readonly rpc: RpcClient) {}

  async list(): Promise<Preset[]> {
    if (this.cached && Date.now() < this.expiresAt) return this.cached;
    const raw = UpstreamParser.parse(
      presetsSchema,
      await this.rpc.call('getListOfPresets'),
      'getListOfPresets',
    );
    this.cached = raw.map((preset) => ({
      id: PresetIdentity.key(preset),
      name: preset.name,
      bank: preset.bank,
      instrument: preset.instrument,
      licenseStatus: preset.license_status,
    }));
    this.expiresAt = Date.now() + 15000;
    return this.cached;
  }

  async load(selection: PresetSelection): Promise<void> {
    const exists = (await this.list()).some(
      (preset) => preset.id === PresetIdentity.key(selection),
    );
    if (!exists)
      throw new AppError(
        'PRESET_NOT_FOUND',
        'This preset is no longer available. Refresh the list.',
        404,
      );
    await this.rpc.call('loadPreset', { ...selection, preset_type: 'full' });
  }
}
