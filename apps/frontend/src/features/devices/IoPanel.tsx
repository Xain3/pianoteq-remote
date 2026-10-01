import type { IoSettings } from '@ptq/shared';
import { Icon } from '../../components/Icon.js';
import { DeviceSelectors } from './DeviceSelectors.js';

interface Props {
  settings: IoSettings | null;
  error: string | null;
  loading: boolean;
  onRefresh: () => void;
}

export function IoPanel({ settings, error, loading, onRefresh }: Props) {
  const audio = settings?.audio;
  return (
    <section className="panel io-panel" aria-labelledby="io-heading">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Your connections</span>
          <h2 id="io-heading">
            <Icon name="settings" />
            Input & output
          </h2>
        </div>
        <button
          className="icon-button"
          disabled={loading}
          onClick={onRefresh}
          aria-label="Refresh audio device information"
        >
          <Icon name="refresh" />
        </button>
      </div>
      <DeviceSelectors settings={settings} />
      <dl className="audio-details">
        <div>
          <dt>Driver</dt>
          <dd>{audio?.driver || '—'}</dd>
        </div>
        <div>
          <dt>Sample rate</dt>
          <dd>{audio?.sampleRate ? `${audio.sampleRate / 1000} kHz` : '—'}</dd>
        </div>
        <div>
          <dt>Buffer</dt>
          <dd>{audio?.bufferSize ? `${audio.bufferSize} samples` : '—'}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{audio?.status || '—'}</dd>
        </div>
      </dl>
      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
      {settings && (
        <details>
          <summary>Available outputs & connection notes</summary>
          <ul className="device-notes">
            {settings.audioDevices.flatMap((group) =>
              group.outputs.map((output) => (
                <li key={`${group.driver}/${output}`}>
                  {output} <small>({group.driver})</small>
                </li>
              )),
            )}
            {settings.notices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
