import { RpcClient } from '../../src/rpc/RpcClient.js';

let fixtureId = 0;

export function instrumentFixture(volumeId = 'volume') {
  let volume = 0.5;
  let name = 'Concert';
  let bank = '';
  const writes: Array<{ id: string; normalized_value: number }> = [];
  const request: typeof fetch = async (_input, options) => {
    const command = JSON.parse(String(options?.body));
    let result: unknown = null;
    switch (command.method) {
      case 'getInfo':
        result = [{ product_name: 'Pianoteq 9', version: '9.0', current_preset: { name, bank } }];
        break;
      case 'getListOfPresets':
        result = [
          { name: 'Concert', bank: '', license_status: 'ok' },
          { name: 'Concert', bank: 'My Presets', license_status: 'ok' },
        ];
        break;
      case 'getParameters':
        result = [{ id: volumeId, text: '-10 dB', normalized_value: volume }];
        break;
      case 'setParameters':
        writes.push(command.params.list[0]);
        volume = command.params.list[0].normalized_value;
        break;
      case 'loadPreset':
        name = command.params.name;
        bank = command.params.bank;
        break;
      case 'getAudioDeviceInfo':
        result = {
          device_type: 'ALSA',
          audio_output_device_name: 'USB',
          sample_rate: '48000',
          buffer_size: '128',
          status: 'running',
        };
        break;
      case 'getListOfAudioDevices':
        result = [{ type: 'ALSA', devices: ['USB'] }];
        break;
      default:
        throw new Error(`Unexpected method ${command.method}`);
    }
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: command.id, result }), {
      status: 200,
    });
  };
  return {
    rpc: new RpcClient(`http://localhost/jsonrpc/${fixtureId++}`, 1000, request),
    writes,
  };
}
