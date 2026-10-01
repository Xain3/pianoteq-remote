import { expect, test } from 'vitest';
import { ParameterIds, PresetIdentity } from '@ptq/shared';
import { PianoteqGateway } from '../src/pianoteq/PianoteqGateway.js';
import { instrumentFixture } from './helpers/rpc-fixture.js';

for (const volumeId of ['Volume', 'volume']) {
  test(`volume writes retain the discovered ID: ${volumeId}`, async () => {
    const fixture = instrumentFixture(volumeId);
    const gateway = new PianoteqGateway(fixture.rpc);
    const snapshot = await gateway.setVolume(0.7);
    expect(snapshot.volume?.normalized).toBe(0.7);
    expect(fixture.writes).toEqual([{ id: volumeId, normalized_value: 0.7 }]);
  });
}

test('normalization covers v9 effect parameter IDs', () => {
  expect(ParameterIds.normalize('Effect[1].Param[1]')).toBe('effect_1_param_1');
});

test('same-named presets keep bank identity during switching', async () => {
  const gateway = new PianoteqGateway(instrumentFixture().rpc);
  const presets = await gateway.getPresets();
  expect(presets[0]?.id).not.toBe(presets[1]?.id);
  const snapshot = await gateway.loadPreset({ name: 'Concert', bank: 'My Presets' });
  expect(snapshot.currentPreset?.bank).toBe('My Presets');
  expect(PresetIdentity.resolve(presets, 'My Presets/Concert')?.bank).toBe('My Presets');
  expect(PresetIdentity.resolve(presets, 'Concert')).toBeNull();
});

test('audio values tolerate strings, and unsupported devices stay explicit', async () => {
  const gateway = new PianoteqGateway(instrumentFixture().rpc);
  const settings = await gateway.getIoSettings();
  expect(settings.audio?.sampleRate).toBe(48000);
  expect(settings.audio?.bufferSize).toBe(128);
  expect(settings.capabilities.selectAudioDevice).toBe(false);
  expect(settings.capabilities.selectMidiDevice).toBe(false);
  expect(settings.midiInputs).toBeNull();
});
