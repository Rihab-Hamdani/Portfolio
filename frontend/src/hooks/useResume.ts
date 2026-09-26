import { useCallback, useState } from 'react';
import { site } from '@/config/site';
import { useToast } from '@/context/ToastContext';
import { track } from './useAnalytics';

/**
 * Downloads the CV only if a real PDF exists at the configured location.
 * (A missing file would otherwise fall back to index.html through SPA routing.)
 */
export function useResume() {
  const toast = useToast();
  const [checking, setChecking] = useState(false);

  const download = useCallback(async () => {
    setChecking(true);
    try {
      const response = await fetch(site.resumeUrl, { method: 'HEAD' });
      const type = response.headers.get('content-type') ?? '';
      if (!response.ok || !type.includes('pdf')) {
        toast.notify('The resume is not available yet. Please reach out through the contact form.');
        return;
      }
      track('resume_download');
      const link = document.createElement('a');
      link.href = site.resumeUrl;
      link.download = site.resumeUrl.split('/').pop() || 'Rihab-Hamdani-CV.pdf';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('Could not download the resume. Please try again.');
    } finally {
      setChecking(false);
    }
  }, [toast]);

  return { download, checking };
}
