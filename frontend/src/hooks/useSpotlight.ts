import { useCallback } from 'react';
import type { MouseEvent } from 'react';

/** Feeds the cursor position to the .spotlight CSS effect. Pure CSS vars, no re-render. */
export function useSpotlight<T extends HTMLElement>() {
  return useCallback((event: MouseEvent<T>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, []);
}
