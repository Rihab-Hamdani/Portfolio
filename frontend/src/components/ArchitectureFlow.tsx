import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Fragment } from 'react';
import { parseStep } from '@/utils/project';
import { cn } from '@/utils/cn';

/** Renders "Label|detail" steps as a connected flow. Horizontal on wide screens, vertical on mobile. */
export function ArchitectureFlow({ steps, compact = false, className }: { steps: string[]; compact?: boolean; className?: string }) {
  if (steps.length === 0) return null;
  const parsed = steps.map(parseStep);
  const horizontal = parsed.length <= 5;

  return (
    <ol
      aria-label="Architecture flow"
      className={cn(
        'flex flex-col items-stretch gap-2',
        horizontal && !compact && 'md:flex-row md:items-center',
        className,
      )}
    >
      {parsed.map((step, i) => (
        <Fragment key={`${step.label}-${i}`}>
          <motion.li
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={cn(
              'relative flex-1 rounded-xl border hairline bg-surface px-3.5 py-3',
              i === 0 && 'border-accent/30 bg-accent/[0.04]',
            )}
          >
            <span className="font-mono text-[10px] text-subtle">{String(i + 1).padStart(2, '0')}</span>
            <p className={cn('font-medium text-ink', compact ? 'text-[13px]' : 'text-sm')}>{step.label}</p>
            {step.detail && <p className="mt-0.5 text-xs leading-snug text-muted">{step.detail}</p>}
          </motion.li>
          {i < parsed.length - 1 && (
            <li aria-hidden className="flex justify-center text-subtle">
              <ArrowDown className={cn('h-4 w-4', horizontal && !compact && 'md:hidden')} />
              {horizontal && !compact && <ArrowRight className="hidden h-4 w-4 md:block" />}
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}
