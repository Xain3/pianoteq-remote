import { ColorMath } from './ColorMath.js';
import type { ThemeColors, ThemeId } from './theme-schema.js';

export interface ThemePreset {
  id: ThemeId;
  name: string;
  description: string;
  swatches: readonly string[];
  colors: ThemeColors;
}

export const themePresets: readonly ThemePreset[] = [
  {
    id: 'current',
    name: 'Current',
    description: 'Cream and sage',
    swatches: ['#F5F3EE', '#FFFEFB', '#293B33', '#234D43', '#E9EEE7'],
    colors: {
      paper: '#F5F3EE',
      surface: '#FFFEFB',
      ink: '#293B33',
      muted: '#727D73',
      accent: '#234D43',
      accentSoft: '#E9EEE7',
      line: '#E0E4DC',
      error: '#984335',
    },
  },
  {
    id: 'muted-green',
    name: 'Muted Green',
    description: 'Light, with forest green and beige',
    swatches: ['#989DA6', '#242526', '#267302', '#D9B596', '#F2F2F2'],
    colors: {
      paper: '#F2F2F2',
      surface: '#FFFFFF',
      ink: '#242526',
      muted: ColorMath.mix('#242526', '#989DA6', 0.55),
      accent: '#267302',
      accentSoft: ColorMath.mix('#F2F2F2', '#D9B596', 0.4),
      line: '#989DA6',
      error: '#984335',
    },
  },
  {
    id: 'muted-olive',
    name: 'Muted Olive & Coral',
    description: 'Dark, with olive and coral',
    swatches: ['#989DA6', '#242526', '#618C03', '#D9B596', '#F25252'],
    colors: {
      paper: '#242526',
      surface: ColorMath.mix('#242526', '#989DA6', 0.12),
      ink: '#D9B596',
      muted: '#989DA6',
      accent: '#618C03',
      accentSoft: ColorMath.mix('#242526', '#618C03', 0.18),
      line: ColorMath.mix('#242526', '#989DA6', 0.4),
      error: '#F25252',
    },
  },
];

export function getThemePreset(id: ThemeId): ThemePreset {
  const preset = themePresets.find((candidate) => candidate.id === id);
  if (!preset) throw new Error(`Unknown theme preset: ${id}`);
  return preset;
}
