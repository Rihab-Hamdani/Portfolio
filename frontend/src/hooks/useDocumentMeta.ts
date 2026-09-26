import { useEffect } from 'react';
import { site } from '@/config/site';

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** Updates title, description, canonical and social tags for client-side routes. */
export function useDocumentMeta({ title, description, path = '/' }: { title?: string; description?: string; path?: string }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : site.title;
    const desc = description || site.description;
    const origin = site.url || window.location.origin;
    const url = `${origin}${path}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', desc);
  }, [title, description, path]);
}
