import { z } from 'zod';

const schema = z.object({
  PTQ_MODE: z.enum(['real', 'demo']).default('real'),
  PTQ_RPC_URL: z.url().default('http://127.0.0.1:8081/jsonrpc'),
  PTQ_RPC_TIMEOUT_MS: z.coerce.number().int().min(250).max(30000).default(4000),
  PTQ_API_HOST: z.string().default('127.0.0.1'),
  PTQ_API_PORT: z.coerce.number().int().min(1).max(65535).default(8787),
});

export function readConfig(environment: NodeJS.ProcessEnv = process.env) {
  const values = schema.parse(environment);
  const url = new URL(values.PTQ_RPC_URL);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('PTQ_RPC_URL must use HTTP(S).');
  return {
    mode: values.PTQ_MODE,
    rpcUrl: url.href,
    rpcTimeoutMs: values.PTQ_RPC_TIMEOUT_MS,
    host: values.PTQ_API_HOST,
    port: values.PTQ_API_PORT,
  };
}

export type AppConfig = ReturnType<typeof readConfig>;
