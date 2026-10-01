import type { InstrumentSnapshot } from '@ptq/shared';
import { PianoMark } from '../../components/PianoMark.js';

export function NowPlaying({ snapshot }: { snapshot: InstrumentSnapshot | null }) {
  return (
    <section className="now-playing" aria-labelledby="instrument-heading">
      <div>
        <span className="eyebrow">Now playing</span>
        <h1 id="instrument-heading">{snapshot?.currentPresetName || 'Make room for music.'}</h1>
        <p>
          {snapshot?.currentPreset?.instrument ||
            snapshot?.product ||
            'Connect your Pianoteq host to get started.'}
        </p>
      </div>
      <PianoMark />
    </section>
  );
}
