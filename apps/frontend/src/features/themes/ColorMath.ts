export class ColorMath {
  private static channels(hex: string): number[] {
    return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  }

  static mix(first: string, second: string, amount: number): string {
    const other = ColorMath.channels(second);
    const channels = ColorMath.channels(first).map((channel, index) =>
      Math.round(channel + ((other[index] ?? channel) - channel) * amount)
        .toString(16)
        .padStart(2, '0'),
    );
    return `#${channels.join('')}`;
  }

  static luminance(hex: string): number {
    const [red = 0, green = 0, blue = 0] = ColorMath.channels(hex).map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return red * 0.2126 + green * 0.7152 + blue * 0.0722;
  }

  static contrast(first: string, second: string): number {
    const one = ColorMath.luminance(first);
    const two = ColorMath.luminance(second);
    return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
  }

  static textOn(background: string): string {
    return ColorMath.contrast(background, '#FFFFFF') >= ColorMath.contrast(background, '#000000')
      ? '#FFFFFF'
      : '#000000';
  }
}
