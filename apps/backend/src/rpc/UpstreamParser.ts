import { z } from 'zod';
import { AppError } from '../errors/AppError.js';

export class UpstreamParser {
  static parse<T>(schema: z.ZodType<T>, value: unknown, method: string): T {
    const parsed = schema.safeParse(value);
    if (!parsed.success)
      throw new AppError('INVALID_UPSTREAM_DATA', `${method} returned an unexpected data format.`);
    return parsed.data;
  }

  static first(value: unknown): unknown {
    return Array.isArray(value) ? value[0] : value;
  }

  static number(value: unknown): number | null {
    if (value === '' || value === undefined || value === null) return null;
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : null;
  }
}
