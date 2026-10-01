import type { Preset, PresetSelection } from '../types/index.js';

export class PresetIdentity {
  static key(preset: PresetSelection): string {
    return JSON.stringify([preset.bank, preset.name]);
  }

  static resolve(presets: readonly Preset[], name: string, bank?: string): Preset | null {
    if (bank !== undefined) {
      return presets.find((preset) => preset.name === name && preset.bank === bank) ?? null;
    }
    const exact = presets.filter((preset) => preset.name === name);
    if (exact.length === 1) return exact[0] ?? null;
    return (
      presets.find((preset) => preset.bank && `${preset.bank}/${preset.name}` === name) ?? null
    );
  }
}
