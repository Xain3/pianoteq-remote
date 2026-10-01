import type { InstrumentSnapshot } from '@ptq/shared';
import { Icon } from '../../components/Icon.js';
import { useVolumeControl } from '../../hooks/useVolumeControl.js';

interface Props {
  volume: InstrumentSnapshot['volume'];
  disabled: boolean;
  onCommit: (value: number) => Promise<boolean>;
}

export function VolumePanel({ volume, disabled, onCommit }: Props) {
  const control = useVolumeControl(volume?.normalized ?? 0, onCommit);
  return (
    <section className="panel volume-panel" aria-labelledby="volume-heading">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">A comfortable level</span>
          <h2 id="volume-heading">
            <Icon name="volume" />
            Master volume
          </h2>
        </div>
        <output htmlFor="volume" className="volume-value">
          {volume ? `${Math.round(control.draft * 100)}%` : '—'}
        </output>
      </div>
      <label className="sr-only" htmlFor="volume">
        Master volume
      </label>
      <input
        id="volume"
        className="volume-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={control.draft}
        disabled={disabled || !volume}
        onChange={(event) => control.change(Number(event.target.value))}
        onPointerUp={() => {
          void control.commit();
        }}
        onKeyUp={() => {
          void control.commit();
        }}
        onBlur={() => {
          void control.commit();
        }}
        aria-describedby="volume-detail"
      />
      <div className="slider-labels">
        <span>Quiet</span>
        <span>Full</span>
      </div>
      <p id="volume-detail" className="panel-footnote">
        {volume
          ? `Pianoteq value: ${volume.text}. The slider shows its normalized range.`
          : 'Volume control is available when the host exposes it.'}
      </p>
    </section>
  );
}
