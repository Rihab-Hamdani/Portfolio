import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Screenshot } from '@/types';

/** Responsive screenshot grid with an accessible, keyboard-driven lightbox. Renders nothing if empty. */
export function ScreenshotGallery({ screenshots, title }: { screenshots: Screenshot[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + screenshots.length) % screenshots.length)),
    [screenshots.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, close, step]);

  if (screenshots.length === 0) return null;
  const current = index === null ? null : screenshots[index];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {screenshots.map((shot, i) => (
          <li key={`${shot.src}-${i}`} className={i === 0 && screenshots.length % 2 === 1 ? 'sm:col-span-2' : undefined}>
            <figure>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group block w-full overflow-hidden rounded-2xl border hairline bg-surface-2"
                aria-label={`Open screenshot: ${shot.caption || shot.alt || `${title} ${i + 1}`}`}
              >
                <img
                  src={shot.src}
                  alt={shot.alt || shot.caption || `${title} screenshot ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                />
              </button>
              {shot.caption && <figcaption className="mt-2 text-sm text-muted">{shot.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>

      {createPortal(
        <AnimatePresence>
          {current && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={current.caption || `${title} screenshot`}
              className="fixed inset-0 z-[95] flex flex-col bg-slate-950/90 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            >
              <div className="flex items-center justify-between p-4 text-slate-200">
                <span className="font-mono text-xs">
                  {(index ?? 0) + 1} / {screenshots.length}
                </span>
                <button type="button" onClick={close} className="rounded-lg p-2 hover:bg-white/10" aria-label="Close" autoFocus>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative flex flex-1 items-center justify-center px-4 pb-4" onClick={(e) => e.stopPropagation()}>
                {screenshots.length > 1 && (
                  <button type="button" onClick={() => step(-1)} className="absolute left-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:left-6" aria-label="Previous screenshot">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt || current.caption || title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl"
                />
                {screenshots.length > 1 && (
                  <button type="button" onClick={() => step(1)} className="absolute right-2 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 sm:right-6" aria-label="Next screenshot">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>
              {current.caption && <p className="px-4 pb-6 text-center text-sm text-slate-300">{current.caption}</p>}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
