import {
  ioSettingsSchema,
  presetListSchema,
  snapshotSchema,
  type PresetSelection,
} from '@ptq/shared';
import { HttpClient } from './HttpClient.js';

export class PianoteqApi {
  static getSnapshot(signal?: AbortSignal) {
    return HttpClient.request('/api/snapshot', snapshotSchema, { signal });
  }
  static getPresets(signal?: AbortSignal) {
    return HttpClient.request('/api/presets', presetListSchema, { signal });
  }
  static getIoSettings(signal?: AbortSignal) {
    return HttpClient.request('/api/devices', ioSettingsSchema, { signal });
  }
  static loadPreset(preset: PresetSelection) {
    return HttpClient.request('/api/presets/load', snapshotSchema, {
      method: 'POST',
      body: JSON.stringify({ name: preset.name, bank: preset.bank }),
    });
  }
  static setVolume(normalized: number) {
    return HttpClient.request('/api/volume', snapshotSchema, {
      method: 'PATCH',
      body: JSON.stringify({ normalized }),
    });
  }
}
