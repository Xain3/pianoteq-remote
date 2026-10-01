import { readConfig } from './config/config.js';
import { loadEnvironment } from './config/environment.js';
import { DemoGateway } from './demo/DemoGateway.js';
import { PianoteqGateway } from './pianoteq/PianoteqGateway.js';
import { RpcClient } from './rpc/RpcClient.js';
import { createServer } from './server.js';

await loadEnvironment();
const config = readConfig();
const gateway =
  config.mode === 'demo'
    ? new DemoGateway()
    : new PianoteqGateway(new RpcClient(config.rpcUrl, config.rpcTimeoutMs));
const server = await createServer(gateway);
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void server.close();
  });
}
await server.listen({ host: config.host, port: config.port });
server.log.info({ mode: config.mode }, 'Pianoteq Remote ready');
