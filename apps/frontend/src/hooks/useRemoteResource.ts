import { useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from '../helpers/error-message.js';

type Loader<T> = (signal: AbortSignal) => Promise<T>;
interface Options {
  pollMs?: number;
  paused?: boolean;
}

export function useRemoteResource<T>(loader: Loader<T>, { pollMs, paused = false }: Options = {}) {
  const [data, setValue] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const generation = useRef(0);

  const cancel = useCallback(() => {
    generation.current += 1;
    controller.current?.abort();
    controller.current = null;
  }, []);

  const refresh = useCallback(async () => {
    cancel();
    const current = generation.current;
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    try {
      const result = await loader(request.signal);
      if (current !== generation.current) return;
      setValue(result);
      setError(null);
    } catch (failure) {
      if (current === generation.current && !request.signal.aborted)
        setError(errorMessage(failure));
    } finally {
      if (current === generation.current) {
        setLoading(false);
        controller.current = null;
      }
    }
  }, [cancel, loader]);

  const accept = useCallback(
    (value: T) => {
      cancel(); // A late read must never overwrite an acknowledged command.
      setValue(value);
      setError(null);
      setLoading(false);
    },
    [cancel],
  );

  useEffect(() => {
    void refresh();
    return cancel;
  }, [cancel, refresh]);
  useEffect(() => {
    if (!pollMs || paused) return;
    const update = () => {
      if (document.visibilityState === 'visible' && !controller.current) void refresh();
    };
    const timer = window.setInterval(update, pollMs);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [pollMs, paused, refresh]);

  return { data, loading, error, refresh, accept };
}
