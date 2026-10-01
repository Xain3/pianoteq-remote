import { z } from 'zod';

export const audioStateSchema = z.object({
  driver: z.string(),
  output: z.string(),
  sampleRate: z.number().nullable(),
  bufferSize: z.number().nullable(),
  status: z.string(),
});

export const ioSettingsSchema = z.object({
  audio: audioStateSchema.nullable(),
  audioDevices: z.array(z.object({ driver: z.string(), outputs: z.array(z.string()) })),
  midiInputs: z.array(z.string()).nullable(),
  capabilities: z.object({
    selectAudioDevice: z.boolean(),
    selectMidiDevice: z.boolean(),
  }),
  notices: z.array(z.string()),
});
