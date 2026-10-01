import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { AppError } from '../errors/AppError.js';

const envelopeSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number(), z.null()]),
  result: z.unknown().optional(),
  error: z.object({ code: z.number(), message: z.string() }).optional(),
});

export class RpcClient {
  constructor(
    private readonly url: string,
    private readonly timeoutMs: number,
    private readonly request: typeof fetch = fetch,
  ) {}

  async call(method: string, params: object | unknown[] = []): Promise<unknown> {
    const id = randomUUID();
    const signal = AbortSignal.timeout(this.timeoutMs);
    try {
      const response = await this.request(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
        signal,
      });
      if (!response.ok)
        throw new AppError('UPSTREAM_HTTP_ERROR', `Pianoteq returned HTTP ${response.status}.`);
      const parsed = envelopeSchema.safeParse(await response.json());
      if (!parsed.success || parsed.data.id !== id) {
        throw new AppError(
          'INVALID_RPC_RESPONSE',
          'Pianoteq returned an invalid or mismatched response.',
        );
      }
      if (parsed.data.error) {
        const { code, message } = parsed.data.error;
        throw new AppError('UPSTREAM_RPC_ERROR', `${method}: ${message}`, 502, code);
      }
      if (!('result' in parsed.data))
        throw new AppError('INVALID_RPC_RESPONSE', 'Pianoteq omitted the result.');
      return parsed.data.result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (signal.aborted)
        throw new AppError('UPSTREAM_TIMEOUT', 'Pianoteq did not respond in time.', 504);
      if (error instanceof SyntaxError)
        throw new AppError('INVALID_RPC_RESPONSE', 'Pianoteq returned invalid JSON.');
      throw new AppError(
        'PIANOTEQ_UNAVAILABLE',
        'Cannot reach Pianoteq. Enable its remote API and reconnect.',
        503,
      );
    }
  }
}
