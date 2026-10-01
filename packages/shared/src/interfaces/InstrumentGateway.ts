import type { InstrumentSnapshot, IoSettings, Preset, PresetSelection } from '../types/index.js';

/** Application contract. RPC payloads and platform details stay behind this boundary. */
export interface InstrumentGateway {
  getSnapshot(): Promise<InstrumentSnapshot>;
  getPresets(): Promise<Preset[]>;
  getIoSettings(): Promise<IoSettings>;
  loadPreset(selection: PresetSelection): Promise<InstrumentSnapshot>;
  setVolume(normalized: number): Promise<InstrumentSnapshot>;
}
