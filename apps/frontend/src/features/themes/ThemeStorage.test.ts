import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeStorage } from './ThemeStorage.js';
import { getThemePreset } from './theme-presets.js';

afterEach(() => vi.unstubAllGlobals());

describe('ThemeStorage', () => {
  it('uses the default palette when there is no saved setting', () => {
    vi.stubGlobal('window', { localStorage: { getItem: () => null } });
    expect(ThemeStorage.load()).toEqual({ version: 1, selected: 'current', overrides: {} });
  });

  it('round trips validated theme preferences', () => {
    const values = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
      },
    });
    const setting = {
      version: 1 as const,
      selected: 'muted-green' as const,
      overrides: { 'muted-green': getThemePreset('muted-green').colors },
    };

    expect(ThemeStorage.save(setting)).toBe(true);
    expect(ThemeStorage.load()).toEqual(setting);
  });

  it('falls back on invalid or unavailable browser storage', () => {
    vi.stubGlobal('window', {
      localStorage: {
        getItem: () => '{broken JSON',
        setItem: () => {
          throw new Error('Storage is blocked');
        },
      },
    });

    expect(ThemeStorage.load().selected).toBe('current');
    expect(ThemeStorage.save({ version: 1, selected: 'current', overrides: {} })).toBe(false);
  });
});
