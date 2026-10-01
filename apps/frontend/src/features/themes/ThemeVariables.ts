import { ColorMath } from './ColorMath.js';
import { themeFields } from './theme-fields.js';
import { getThemePreset } from './theme-presets.js';
import type { ThemeColors, ThemeId } from './theme-schema.js';

const derivedVariables = [
  '--on-accent',
  '--focus',
  '--pill',
  '--status-dot',
  '--status-on',
  '--demo-background',
  '--demo-ink',
  '--error-surface',
  '--preset-icon',
  '--hover-surface',
  '--selected-border',
  '--field-surface',
  '--field-ink',
  '--key-fill',
  '--key-frame',
  '--key-line',
  '--key-dark',
  '--shadow',
  '--shadow-strong',
] as const;

export class ThemeVariables {
  static apply(id: ThemeId, colors: ThemeColors): void {
    const root = document.documentElement;
    for (const field of themeFields) root.style.setProperty(field.variable, colors[field.key]);

    const original = getThemePreset('current').colors;
    const unchanged =
      id === 'current' &&
      themeFields.every(({ key }) => colors[key].toLowerCase() === original[key].toLowerCase());

    if (unchanged) {
      // Default CSS retains every original colour, including decorative details.
      for (const variable of derivedVariables) root.style.removeProperty(variable);
    } else {
      const mix = ColorMath.mix;
      const derived: Record<(typeof derivedVariables)[number], string> = {
        '--on-accent': ColorMath.textOn(colors.accent),
        '--focus': colors.accent,
        '--pill': mix(colors.surface, colors.line, 0.2),
        '--status-dot': colors.muted,
        '--status-on': colors.accent,
        '--demo-background': mix(colors.surface, colors.accentSoft, 0.7),
        '--demo-ink': mix(colors.ink, colors.accent, 0.25),
        '--error-surface': mix(colors.surface, colors.error, 0.12),
        '--preset-icon': colors.muted,
        '--hover-surface': mix(colors.surface, colors.accent, 0.06),
        '--selected-border': mix(colors.line, colors.accent, 0.3),
        '--field-surface': mix(colors.surface, colors.paper, 0.4),
        '--field-ink': colors.muted,
        '--key-fill': mix(colors.surface, colors.line, 0.3),
        '--key-frame': colors.line,
        '--key-line': mix(colors.surface, colors.ink, 0.25),
        '--key-dark': colors.accent,
        '--shadow': `${colors.ink}03`,
        '--shadow-strong': `${colors.ink}22`,
      };
      for (const variable of derivedVariables) root.style.setProperty(variable, derived[variable]);
    }

    // Keep the editor readable even when someone chooses matching text/background colours.
    const editorInk = ColorMath.textOn(colors.surface);
    root.style.setProperty('--editor-ink', editorInk);
    root.style.setProperty('--editor-muted', ColorMath.mix(editorInk, colors.surface, 0.35));
    root.style.setProperty('--editor-line', ColorMath.mix(colors.surface, editorInk, 0.2));
    root.style.colorScheme = ColorMath.luminance(colors.paper) < 0.179 ? 'dark' : 'light';
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', colors.accent);
  }
}
