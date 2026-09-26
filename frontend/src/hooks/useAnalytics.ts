import { useCallback } from 'react';
import { publicApi } from '@/api/endpoints';
import type { AnalyticsEventType } from '@/types';

/** Respects the browser's Do Not Track setting: nothing is sent when it is on. */
function trackingAllowed() {
  if (typeof navigator === 'undefined') return false;
  const dnt = navigator.doNotTrack || (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt !== '1' && dnt !== 'yes';
}

export function track(eventType: AnalyticsEventType, extra: { page?: string; projectSlug?: string } = {}) {
  if (!trackingAllowed()) return;
  const page = extra.page ?? window.location.pathname;
  // Fire-and-forget: analytics must never break or slow down the UI.
  publicApi.track({ eventType, page, projectSlug: extra.projectSlug }).catch(() => undefined);
}

export function useTrack() {
  return useCallback(track, []);
}
