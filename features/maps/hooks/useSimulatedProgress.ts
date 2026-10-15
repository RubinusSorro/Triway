import { useEffect, useState } from 'react';

// Returns 0 to 1 over `durationMs` while `active`. Restarts whenever `resetKey` changes.
export function useSimulatedProgress(active: boolean, durationMs: number, resetKey: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    if (!active) return;
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / durationMs);
      setProgress(p);
      if (p >= 1) clearInterval(id);
    }, 250);
    return () => clearInterval(id);
  }, [active, durationMs, resetKey]);

  return progress;
}
