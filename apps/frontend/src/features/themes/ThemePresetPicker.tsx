import { themePresets } from './theme-presets.js';
import type { ThemeId } from './theme-schema.js';

interface Props {
  selected: ThemeId;
  onSelect: (id: ThemeId) => void;
}

export function ThemePresetPicker({ selected, onSelect }: Props) {
  return (
    <fieldset className="theme-presets">
      <legend>Presets</legend>
      <div className="theme-preset-grid">
        {themePresets.map((preset) => (
          <button
            type="button"
            className="theme-preset"
            key={preset.id}
            aria-pressed={selected === preset.id}
            onClick={() => onSelect(preset.id)}
          >
            <strong>{preset.name}</strong>
            <span className="theme-swatches" aria-hidden="true">
              {preset.swatches.map((color) => (
                <span key={color} style={{ backgroundColor: color }} />
              ))}
            </span>
            <small>{preset.description}</small>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
