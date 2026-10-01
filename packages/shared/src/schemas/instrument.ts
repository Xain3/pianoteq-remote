import { z } from 'zod';
import { presetSchema } from './preset.js';

export const volumeCommandSchema = z.object({ normalized: z.number().min(0).max(1) });
export const volumeSchema = volumeCommandSchema.extend({ text: z.string() });

export const snapshotSchema = z.object({
  mode: z.enum(['real', 'demo']),
  product: z.string(),
  version: z.string(),
  currentPresetName: z.string(),
  currentPreset: presetSchema.nullable(),
  volume: volumeSchema.nullable(),
  capturedAt: z.string(),
});
