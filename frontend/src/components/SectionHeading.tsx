import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { cn } from '@/utils/cn';

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = 'left',
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <Reveal className={cn('mb-10 max-w-2xl sm:mb-14', align === 'center' && 'mx-auto text-center', className)}>
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 id={id} className="text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </Reveal>
  );
}

/** Serif italic accent used sparingly inside headings. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="font-serif text-[1.08em] font-normal italic tracking-normal text-gradient">{children}</span>;
}
