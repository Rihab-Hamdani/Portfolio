import { useEffect, useState } from 'react';

/** Shown when content takes a while: the free backend may be waking up from sleep. */
export function WakingUpNotice({ active, delayMs = 4000 }: { active: boolean; delayMs?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), delayMs);
    return () => window.clearTimeout(timer);
  }, [active, delayMs]);

  if (!visible) return null;
  return (
    <p role="status" className="mb-4 flex items-center gap-2 text-sm text-muted">
      <span
        aria-hidden="true"
        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent"
      />
      Waking up the server — this can take up to a minute on free hosting…
    </p>
  );
}