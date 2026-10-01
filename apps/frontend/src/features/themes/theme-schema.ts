import { z } from 'zod';

export const hexColorSchema = z.string().regex(/^#[0-9a-f]{6}$/i);
export const themeIdSchema = z.enum(['current', 'muted-green', 'muted-olive']);

export const themeColorsSchema = z.object({
  paper: hexColorSchema,
  surface: hexColorSchema,
  ink: hexColorSchema,
  muted: hexColorSchema,
  accent: hexColorSchema,
  accentSoft: hexColorSchema,
  line: hexColorSchema,
  error: hexColorSchema,
});

export const themeSettingsSchema = z.object({
  version: z.literal(1),
  selected: themeIdSchema,
  overrides: z.object({
    current: themeColorsSchema.optional(),
    'muted-green': themeColorsSchema.optional(),
    'muted-olive': themeColorsSchema.optional(),
  }),
});

export type ThemeId = z.infer<typeof themeIdSchema>;
export type ThemeColors = z.infer<typeof themeColorsSchema>;
export type ThemeColorKey = keyof ThemeColors;
export type ThemeSettings = z.infer<typeof themeSettingsSchema>;
