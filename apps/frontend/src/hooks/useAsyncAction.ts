import { useCallback, useRef, useState } from 'react';
import { errorMessage } from '../helpers/error-message.js';

export function useAsyncAction() {
  const active = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async <T>(operation: () => Promise<T>, accept: (value: T) => void) => {
    if (active.current) return false;
    active.current = true;
    setBusy(true);
    setError(null);
    try {
      accept(await operation());
      return true;
    } catch (failure) {
      setError(errorMessage(failure));
      return false;
    } finally {
      active.current = false;
      setBusy(false);
    }
  }, []);

  return { busy, error, run, clearError: () => setError(null) };
}
