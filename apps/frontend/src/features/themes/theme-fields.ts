import type { ThemeColorKey } from './theme-schema.js';

export const themeFields = [
  { key: 'paper', label: 'Background', variable: '--paper' },
  { key: 'surface', label: 'Panels', variable: '--surface' },
  { key: 'ink', label: 'Main text', variable: '--ink' },
  { key: 'muted', label: 'Secondary text', variable: '--muted' },
  { key: 'accent', label: 'Accent', variable: '--green' },
  { key: 'accentSoft', label: 'Selected items', variable: '--green-soft' },
  { key: 'line', label: 'Borders', variable: '--line' },
  { key: 'error', label: 'Errors', variable: '--error' },
] as const satisfies readonly { key: ThemeColorKey; label: string; variable: string }[];
