import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type BadgeTone = 'accent' | 'violet' | 'cyan' | 'warning' | 'neutral' | 'success' | 'danger';

const tones: Record<BadgeTone, string> = {
  accent: 'bg-accent/10 text-accent ring-accent/20',
  violet: 'bg-violet/10 text-violet ring-violet/20',
  cyan: 'bg-cyan/10 text-cyan ring-cyan/25',
  warning: 'bg-warning/10 text-warning ring-warning/25',
  success: 'bg-success/10 text-success ring-success/25',
  danger: 'bg-danger/10 text-danger ring-danger/25',
  neutral: 'bg-surface-2 text-muted ring-line/10',
};

export function Badge({ tone = 'neutral', children, className, dot }: { tone?: BadgeTone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

export function TechChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border hairline bg-surface-2/60 px-2 py-1 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}
