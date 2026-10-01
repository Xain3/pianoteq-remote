import type { IoSettings } from '@ptq/shared';

export function DeviceSelectors({ settings }: { settings: IoSettings | null }) {
  const current = settings?.audio;
  const key = current?.output ? JSON.stringify([current.driver, current.output]) : '';
  const known = settings?.audioDevices.some(
    (group) => group.driver === current?.driver && group.outputs.includes(current?.output ?? ''),
  );
  return (
    <div className="device-selectors">
      <div className="field">
        <label htmlFor="audio-output">
          Audio output <span className="tag">Read only</span>
        </label>
        <select id="audio-output" value={key} disabled aria-describedby="device-support">
          <option value="">
            {current ? 'No output selected' : 'Output information unavailable'}
          </option>
          {key && !known && <option value={key}>{current?.output}</option>}
          {settings?.audioDevices.map((group) => (
            <optgroup label={group.driver} key={group.driver}>
              {group.outputs.map((output) => (
                <option key={output} value={JSON.stringify([group.driver, output])}>
                  {output}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="midi-input">
          MIDI input <span className="tag">Unavailable</span>
        </label>
        <select id="midi-input" disabled aria-describedby="device-support">
          <option>Configured in Pianoteq</option>
        </select>
      </div>
      <p id="device-support" className="device-support">
        Choose audio and MIDI devices in Pianoteq. This adapter can read audio settings, but device
        switching is not supported.
      </p>
    </div>
  );
}
