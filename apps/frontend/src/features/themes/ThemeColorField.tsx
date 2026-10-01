import { useEffect, useId, useState } from 'react';
import { hexColorSchema } from './theme-schema.js';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ThemeColorField({ label, value, onChange }: Props) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    setDraft(value);
  }, [value]);
  const valid = hexColorSchema.safeParse(draft).success;

  return (
    <div className="theme-color-field">
      <label htmlFor={id}>{label}</label>
      <div className="theme-color-inputs">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          type="text"
          value={draft}
          aria-label={`${label} hex code`}
          aria-invalid={!valid}
          aria-describedby={!valid ? `${id}-help` : undefined}
          spellCheck={false}
          maxLength={7}
          onChange={(event) => {
            const next = event.target.value;
            setDraft(next);
            if (hexColorSchema.safeParse(next).success) onChange(next);
          }}
          onBlur={() => {
            if (!valid) setDraft(value);
          }}
        />
      </div>
      {!valid && <small id={`${id}-help`}>Use #RRGGBB. Incomplete values are not applied.</small>}
    </div>
  );
}
