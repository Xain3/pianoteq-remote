import { PresetIdentity, type Preset } from '@ptq/shared';

const selections = [
  { name: 'Concert Grand', bank: '', instrument: 'Grand piano' },
  { name: 'Intimate Room', bank: '', instrument: 'Grand piano' },
  { name: 'Soft Felt', bank: 'My Presets', instrument: 'Upright piano' },
  { name: 'Warm Electric', bank: '', instrument: 'Electric piano' },
  { name: 'Concert Grand', bank: 'My Presets', instrument: 'Grand piano' },
  { name: 'Vintage Upright', bank: '', instrument: 'Upright piano' },
];

export const demoPresets: Preset[] = selections.map((preset) => ({
  ...preset,
  id: PresetIdentity.key(preset),
  licenseStatus: 'demo',
}));
