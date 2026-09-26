import { useState } from 'react';
import { site } from '@/config/site';
import { cn } from '@/utils/cn';

/**
 * Uses the real profile photo if it exists at VITE_PROFILE_PHOTO (default /images/profile.jpg).
 * If not, a typographic monogram is shown — a face is never generated.
 */
export function ProfilePortrait({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn('gradient-border relative overflow-hidden rounded-[2rem] bg-surface shadow-lift', className)}>
      {!failed ? (
        <img
          src={site.profilePhoto}
          alt="Portrait of Rihab Hamdani"
          width={640}
          height={720}
          {...{ fetchpriority: "high" }}
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="relative grid h-full w-full place-items-center overflow-hidden" role="img" aria-label="Rihab Hamdani monogram">
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,rgb(var(--accent)/0.35),transparent_55%),radial-gradient(90%_70%_at_90%_90%,rgb(var(--violet)/0.35),transparent_55%),radial-gradient(60%_50%_at_80%_20%,rgb(var(--cyan)/0.18),transparent_60%)]" />
          <div className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
          <div className="relative text-center">
            <span className="block font-serif text-[7rem] italic leading-none text-ink sm:text-[8.5rem]">rh</span>
            <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Rihab Hamdani</span>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/35 to-transparent" />
    </div>
  );
}
