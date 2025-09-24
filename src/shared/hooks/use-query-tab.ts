import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryTab<K extends string>(key: string, defaultKey: K, allowed: readonly K[]) {
  const [params, setParams] = useSearchParams();

  const current = useMemo(() => {
    const raw = params.get(key) as K | null;
    return raw && (allowed as readonly string[]).includes(raw) ? (raw as K) : defaultKey;
  }, [params, key, defaultKey, allowed]);

  const set = useCallback(
    (next: K, replace = true) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set(key, next);
          return p;
        },
        { replace }
      );
    },
    [key, setParams]
  );

  return [current, set] as const;
}
