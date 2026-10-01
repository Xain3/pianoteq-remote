import { themeSettingsSchema } from './theme-schema.js';
import type { ThemeSettings } from './theme-schema.js';

export class ThemeStorage {
  private static readonly key = 'pianoteq-remote.theme.v1';

  static load(): ThemeSettings {
    try {
      const stored = window.localStorage.getItem(ThemeStorage.key);
      const parsed = themeSettingsSchema.safeParse(stored ? JSON.parse(stored) : null);
      if (parsed.success) return parsed.data;
    } catch {
      /* A restricted browser or invalid saved data uses the current theme. */
    }
    return { version: 1, selected: 'current', overrides: {} };
  }

  static save(settings: ThemeSettings): boolean {
    try {
      window.localStorage.setItem(ThemeStorage.key, JSON.stringify(settings));
      return true;
    } catch {
      return false;
    }
  }
}
