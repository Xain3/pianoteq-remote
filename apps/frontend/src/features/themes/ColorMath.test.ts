import { describe, expect, it } from 'vitest';
import { ColorMath } from './ColorMath.js';

describe('ColorMath', () => {
  it('mixes RGB channels at the requested ratio', () => {
    expect(ColorMath.mix('#000000', '#FFFFFF', 0.5)).toBe('#808080');
    expect(ColorMath.mix('#123456', '#123456', 0.8)).toBe('#123456');
  });

  it('calculates luminance and contrast across light and dark colours', () => {
    expect(ColorMath.luminance('#FFFFFF')).toBeCloseTo(1);
    expect(ColorMath.luminance('#000000')).toBe(0);
    expect(ColorMath.contrast('#000000', '#FFFFFF')).toBeCloseTo(21);
  });

  it('chooses whichever foreground has the stronger contrast', () => {
    expect(ColorMath.textOn('#FFFFFF')).toBe('#000000');
    expect(ColorMath.textOn('#000000')).toBe('#FFFFFF');
  });
});
