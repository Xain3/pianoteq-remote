import type { InstrumentGateway, PresetSelection } from '@ptq/shared';
import { CommandQueue } from '../helpers/CommandQueue.js';
import { RpcClient } from '../rpc/RpcClient.js';
import { DeviceService } from './DeviceService.js';
import { ParameterService } from './ParameterService.js';
import { PresetService } from './PresetService.js';
import { SnapshotService } from './SnapshotService.js';

export class PianoteqGateway implements InstrumentGateway {
  private readonly commands = new CommandQueue();
  private readonly presets: PresetService;
  private readonly parameters: ParameterService;
  private readonly devices: DeviceService;
  private readonly snapshots: SnapshotService;

  constructor(rpc: RpcClient) {
    this.presets = new PresetService(rpc);
    this.parameters = new ParameterService(rpc);
    this.devices = new DeviceService(rpc);
    this.snapshots = new SnapshotService(rpc, this.parameters, this.presets);
  }

  getSnapshot() {
    return this.snapshots.read();
  }
  getPresets() {
    return this.presets.list();
  }
  getIoSettings() {
    return this.devices.read();
  }

  loadPreset(selection: PresetSelection) {
    return this.commands.run(async () => {
      await this.presets.load(selection);
      return this.snapshots.read();
    });
  }

  setVolume(normalized: number) {
    return this.commands.run(async () => {
      await this.parameters.setVolume(normalized);
      return this.snapshots.read();
    });
  }
}
