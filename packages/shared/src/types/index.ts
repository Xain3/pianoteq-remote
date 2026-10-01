import type { z } from 'zod';
import type { ioSettingsSchema } from '../schemas/devices.js';
import type { snapshotSchema, volumeCommandSchema } from '../schemas/instrument.js';
import type { presetSchema, presetSelectionSchema } from '../schemas/preset.js';

export type Preset = z.infer<typeof presetSchema>;
export type PresetSelection = z.infer<typeof presetSelectionSchema>;
export type InstrumentSnapshot = z.infer<typeof snapshotSchema>;
export type IoSettings = z.infer<typeof ioSettingsSchema>;
export type VolumeCommand = z.infer<typeof volumeCommandSchema>;

export interface ApiErrorBody {
  error: { code: string; message: string };
}
