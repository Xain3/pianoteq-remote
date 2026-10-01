import { describe, expect, it } from 'vitest';
import { hexColorSchema, themeSettingsSchema } from './theme-schema.js';
import { getThemePreset } from './theme-presets.js';

describe('theme validation', () => {
  it('accepts six-digit hex colours and rejects malformed input', () => {
    expect(hexColorSchema.safeParse('#A1B2C3').success).toBe(true);
    expect(hexColorSchema.safeParse('#abc').success).toBe(false);
    expect(hexColorSchema.safeParse('red').success).toBe(false);
  });

  it('accepts versioned settings with only known colour overrides', () => {
    const settings = {
      version: 1,
      selected: 'muted-olive',
      overrides: { 'muted-olive': getThemePreset('muted-olive').colors },
    };
    expect(themeSettingsSchema.safeParse(settings).success).toBe(true);
    expect(
      themeSettingsSchema.safeParse({ ...settings, selected: 'arbitrary-css-url' }).success,
    ).toBe(false);
  });
});
