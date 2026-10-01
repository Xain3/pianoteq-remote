import { useMemo, useState } from 'react';
import type { Preset } from '@ptq/shared';
import { Icon } from '../../components/Icon.js';

interface Props {
  presets: Preset[];
  currentId?: string;
  disabled: boolean;
  onSelect: (preset: Preset) => void;
}

export function PresetPanel({ presets, currentId, disabled, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () =>
      presets.filter((preset) =>
        `${preset.name} ${preset.bank} ${preset.instrument}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [presets, query],
  );

  return (
    <section className="panel preset-panel" aria-labelledby="preset-heading">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Find your sound</span>
          <h2 id="preset-heading">Preset library</h2>
        </div>
        <span className="count">{presets.length}</span>
      </div>
      <label className="search-field">
        <Icon name="search" />
        <input
          type="search"
          aria-label="Search presets"
          placeholder="Search presets…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <ul className="preset-list">
        {filtered.map((preset) => (
          <li key={preset.id}>
            <button
              className={`preset-button ${preset.id === currentId ? 'selected' : ''}`}
              disabled={disabled || preset.id === currentId}
              onClick={() => onSelect(preset)}
              aria-pressed={preset.id === currentId}
            >
              <span>
                <strong>{preset.name}</strong>
                <small>{preset.bank || preset.instrument || 'Factory preset'}</small>
              </span>
              {preset.id === currentId ? <Icon name="check" /> : <Icon name="arrow" />}
            </button>
          </li>
        ))}
      </ul>
      {!filtered.length && (
        <p className="empty-state">
          {presets.length
            ? 'No presets match your search.'
            : 'Connect to Pianoteq to browse your instruments.'}
        </p>
      )}
      <p className="panel-footnote">Presets come from your Pianoteq host.</p>
    </section>
  );
}
