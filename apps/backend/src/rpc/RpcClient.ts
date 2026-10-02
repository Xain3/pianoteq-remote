import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { AppError } from '../errors/AppError.js';
import { AsyncLock } from './AsyncLock.js';

const envelopeSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number(), z.null()]),
  result: z.unknown().optional(),
  error: z.object({ code: z.number(), message: z.string() }).optional(),
});

const sessionOwners = new Map<string, RpcClient>();

function normalizeSessionId(sessionId: string): string {
  const normalized = sessionId.trim();
  if (!normalized)
    throw new AppError('INVALID_RPC_SESSION', 'Pianoteq session identity cannot be empty.', 400);
  try {
    const url = new URL(normalized);
    url.hash = '';
    return url.href;
  } catch {
    return normalized;
  }
}

export class RpcClient {
  private readonly lock = new AsyncLock();
  private readonly sessionId: string;
  private disposed = false;
  private disposePromise?: Promise<void>;

  constructor(
    private readonly url: string,
    private readonly timeoutMs: number,
    private readonly request: typeof fetch = fetch,
    sessionId = url,
  ) {
    this.sessionId = normalizeSessionId(sessionId);
    if (sessionOwners.has(this.sessionId)) {
      throw new AppError(
        'RPC_SESSION_IN_USE',
        'Another RPC client already owns this Pianoteq session.',
        409,
      );
    }
    sessionOwners.set(this.sessionId, this);
  }

  async call(method: string, params: object | unknown[] = []): Promise<unknown> {
    if (this.disposed)
      throw new AppError('RPC_CLIENT_DISPOSED', 'This Pianoteq RPC client has been disposed.', 409);
    return this.lock.run(() => this.execute(method, params));
  }

  dispose(): Promise<void> {
    if (this.disposePromise) return this.disposePromise;
    this.disposed = true;
    this.disposePromise = this.lock
      .run(async () => undefined)
      .then(() => {
        if (sessionOwners.get(this.sessionId) === this) sessionOwners.delete(this.sessionId);
      });
    return this.disposePromise;
  }

  private async execute(method: string, params: object | unknown[]): Promise<unknown> {
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
