import type { ApiErrorBody } from '@ptq/shared';
import type { z } from 'zod';

export class HttpClient {
  static async request<T>(
    path: string,
    schema: z.ZodType<T>,
    options: RequestInit = {},
  ): Promise<T> {
    const signals = [AbortSignal.timeout(8000)];
    if (options.signal) signals.push(options.signal);
    const response = await fetch(path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: AbortSignal.any(signals),
      cache: 'no-store',
    });
    const payload: unknown = await response.json();
    if (!response.ok) {
      const error = payload as Partial<ApiErrorBody>;
      throw new Error(error.error?.message ?? `Request failed (${response.status}).`);
    }
    const parsed = schema.safeParse(payload);
    if (!parsed.success) throw new Error('The host returned an unexpected response.');
    return parsed.data;
  }
}
