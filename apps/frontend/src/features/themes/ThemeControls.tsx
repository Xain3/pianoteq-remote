import { useRef } from 'react';
import { ColorMath } from './ColorMath.js';
import { ThemeColorField } from './ThemeColorField.js';
import { ThemePresetPicker } from './ThemePresetPicker.js';
import { getThemePreset } from './theme-presets.js';
import { themeFields } from './theme-fields.js';
import { useTheme } from './useTheme.js';
import './themes.css';

export function ThemeControls() {
  const dialog = useRef<HTMLDialogElement>(null);
  const theme = useTheme();
  const preset = getThemePreset(theme.selected);
  const contrast = ColorMath.contrast(theme.colors.ink, theme.colors.surface).toFixed(1);

  return (
    <>
      <button type="button" className="theme-trigger" onClick={() => dialog.current?.showModal()}>
        Appearance
      </button>
      <dialog
        ref={dialog}
        className="theme-editor"
        aria-labelledby="theme-title"
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          ) {
            dialog.current?.close();
          }
        }}
      >
        <div className="theme-editor-heading">
          <div>
            <span className="eyebrow">Make it yours</span>
            <h2 id="theme-title">Theme palettes</h2>
          </div>
          <button type="button" className="theme-done" onClick={() => dialog.current?.close()}>
            Done
          </button>
        </div>
        <ThemePresetPicker selected={theme.selected} onSelect={theme.select} />
        <div className="theme-edit-heading">
          <h3>
            {preset.name}
            {theme.edited ? ' — edited' : ''}
          </h3>
          <button
            type="button"
            className="theme-reset"
            disabled={!theme.edited}
            onClick={theme.reset}
          >
            Reset this preset
          </button>
        </div>
        <p className="theme-description">
          Colours update immediately. Each preset remembers its own edits.
        </p>
        <div className="theme-color-grid">
          {themeFields.map(({ key, label }) => (
            <ThemeColorField
              key={`${theme.selected}-${key}`}
              label={label}
              value={theme.colors[key]}
              onChange={(value) => theme.update(key, value)}
            />
          ))}
        </div>
        <div className="theme-editor-footer">
          <span>Panel text contrast: {contrast}:1</span>
          <span role="status">
            {theme.saved
              ? 'Saved on this browser.'
              : 'Applied for this session. Browser storage is unavailable.'}
          </span>
        </div>
      </dialog>
    </>
  );
}
