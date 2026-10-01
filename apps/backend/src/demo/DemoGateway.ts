import {
  PresetIdentity,
  type InstrumentGateway,
  type InstrumentSnapshot,
  type IoSettings,
  type PresetSelection,
} from '@ptq/shared';
import { AppError } from '../errors/AppError.js';
import { demoPresets } from './presets.js';

/** Explicit in-memory simulation. Never connects to Pianoteq and never replaces real mode on failure. */
export class DemoGateway implements InstrumentGateway {
  private current = demoPresets[0]!;
  private volume = 0.65;

  async getSnapshot(): Promise<InstrumentSnapshot> {
    return {
      mode: 'demo',
      product: 'Pianoteq Remote demo',
      version: 'Simulated',
      currentPresetName: this.current.name,
      currentPreset: this.current,
      volume: { normalized: this.volume, text: `${Math.round(this.volume * 100)}% (simulated)` },
      capturedAt: new Date().toISOString(),
    };
  }

  async getPresets() {
    return demoPresets;
  }

  async loadPreset(selection: PresetSelection) {
    const preset = demoPresets.find((item) => item.id === PresetIdentity.key(selection));
    if (!preset) throw new AppError('PRESET_NOT_FOUND', 'Preset not found.', 404);
    this.current = preset;
    return this.getSnapshot();
  }

  async setVolume(normalized: number) {
    this.volume = normalized;
    return this.getSnapshot();
  }

  async getIoSettings(): Promise<IoSettings> {
    return {
      audio: {
        driver: 'Demo driver',
        output: 'Demo audio interface',
        sampleRate: 48000,
        bufferSize: 128,
        status: 'Simulated',
      },
      audioDevices: [{ driver: 'Demo driver', outputs: ['Demo audio interface'] }],
      midiInputs: null,
      capabilities: { selectAudioDevice: false, selectMidiDevice: false },
      notices: ['Audio settings are simulated. Device switching is unavailable in this MVP.'],
    };
  }
}
