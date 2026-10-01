import type { IoSettings } from '@ptq/shared';
import { z } from 'zod';
import { RpcClient } from '../rpc/RpcClient.js';
import { UpstreamParser } from '../rpc/UpstreamParser.js';

const audioSchema = z.object({
  device_type: z.string().default(''),
  audio_output_device_name: z.string().default(''),
  sample_rate: z.unknown().optional(),
  buffer_size: z.unknown().optional(),
  status: z.string().default('unknown'),
});
const devicesSchema = z.array(z.object({ type: z.string(), devices: z.array(z.string()) }));

export class DeviceService {
  constructor(private readonly rpc: RpcClient) {}

  async read(): Promise<IoSettings> {
    // Only documented read methods are called. Device writes and MIDI enumeration are unverified.
    const reads = await Promise.allSettled([
      this.rpc.call('getAudioDeviceInfo'),
      this.rpc.call('getListOfAudioDevices'),
    ]);
    const notices = [
      'Audio and MIDI device switching are not supported by this adapter. Select devices in Pianoteq.',
      'Pianoteq MIDI device enumeration has not been verified; the input list is unavailable.',
    ];
    const info = reads[0];
    const devices = reads[1];
    let audio: IoSettings['audio'] = null;
    let audioDevices: IoSettings['audioDevices'] = [];
    if (info?.status === 'fulfilled') {
      const raw = UpstreamParser.parse(
        audioSchema,
        UpstreamParser.first(info.value),
        'getAudioDeviceInfo',
      );
      audio = {
        driver: raw.device_type,
        output: raw.audio_output_device_name,
        sampleRate: UpstreamParser.number(raw.sample_rate),
        bufferSize: UpstreamParser.number(raw.buffer_size),
        status: raw.status,
      };
    } else notices.push('Current audio information could not be read.');
    if (devices?.status === 'fulfilled') {
      audioDevices = UpstreamParser.parse(
        devicesSchema,
        devices.value,
        'getListOfAudioDevices',
      ).map((group) => ({ driver: group.type, outputs: group.devices }));
    } else notices.push('Available audio devices could not be read.');
    return {
      audio,
      audioDevices,
      midiInputs: null,
      capabilities: { selectAudioDevice: false, selectMidiDevice: false },
      notices,
    };
  }
}
