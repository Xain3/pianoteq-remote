import { z } from 'zod';

export const presetSelectionSchema = z.object({
  name: z.string().trim().min(1).max(512),
  bank: z.string().max(512),
});

export const presetSchema = presetSelectionSchema.extend({
  id: z.string(),
  instrument: z.string(),
  licenseStatus: z.string(),
});

export const presetListSchema = z.array(presetSchema);
