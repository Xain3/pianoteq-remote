import { useEffect, useRef, useState } from 'react';

export function useVolumeControl(current: number, onCommit: (value: number) => Promise<boolean>) {
  const [draft, setDraft] = useState(current);
  const value = useRef(current);
  const dirty = useRef(false);
  useEffect(() => {
    if (!dirty.current) {
      setDraft(current);
      value.current = current;
    }
  }, [current]);

  function change(next: number) {
    dirty.current = true;
    value.current = next;
    setDraft(next);
  }

  async function commit() {
    if (!dirty.current) return;
    dirty.current = false;
    if (!(await onCommit(value.current))) {
      setDraft(current);
      value.current = current;
    }
  }

  return { draft, change, commit };
}
