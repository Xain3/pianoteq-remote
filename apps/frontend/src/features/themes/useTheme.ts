import { useEffect, useLayoutEffect, useState } from 'react';
import { ThemeStorage } from './ThemeStorage.js';
import { ThemeVariables } from './ThemeVariables.js';
import { getThemePreset } from './theme-presets.js';
import { hexColorSchema } from './theme-schema.js';
import type { ThemeColorKey, ThemeId } from './theme-schema.js';

export function useTheme() {
  const [settings, setSettings] = useState(ThemeStorage.load);
  const [saved, setSaved] = useState(true);
  const colors = settings.overrides[settings.selected] ?? getThemePreset(settings.selected).colors;

  useLayoutEffect(() => {
    ThemeVariables.apply(settings.selected, colors);
  }, [colors, settings.selected]);

  useEffect(() => {
    setSaved(ThemeStorage.save(settings));
  }, [settings]);

  function select(id: ThemeId) {
    setSettings((previous) => ({ ...previous, selected: id }));
  }

  function update(key: ThemeColorKey, value: string) {
    if (!hexColorSchema.safeParse(value).success) return;
    setSettings((previous) => {
      const palette =
        previous.overrides[previous.selected] ?? getThemePreset(previous.selected).colors;
      return {
        ...previous,
        overrides: {
          ...previous.overrides,
          [previous.selected]: { ...palette, [key]: value.toUpperCase() },
        },
      };
    });
  }

  function reset() {
    setSettings((previous) => {
      const overrides = { ...previous.overrides };
      delete overrides[previous.selected];
      return { ...previous, overrides };
    });
  }

  return {
    selected: settings.selected,
    colors,
    select,
    update,
    reset,
    saved,
    edited: Boolean(settings.overrides[settings.selected]),
  };
}
