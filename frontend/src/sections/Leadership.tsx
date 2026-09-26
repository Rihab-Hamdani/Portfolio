import { motion } from 'framer-motion';
import { Cpu, Users } from 'lucide-react';
import { Accent, SectionHeading } from '@/components/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useLeadership } from '@/hooks/usePublicContent';
import { useSpotlight } from '@/hooks/useSpotlight';
import { cn } from '@/utils/cn';
import type { LeadershipRole } from '@/types';

function RoleCard({ role, index, primary }: { role: LeadershipRole; index: number; primary: boolean }) {
  const onMouseMove = useSpotlight<HTMLElement>();
  const hasDetails = role.organizational.length > 0 || role.technical.length > 0;
  return (
    <motion.article
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      className={cn(
        'spotlight relative flex h-full flex-col overflow-hidden rounded-3xl border hairline p-6 sm:p-8',
        primary ? 'gradient-border bg-gradient-to-br from-accent/[0.07] via-surface to-violet/[0.07] lg:col-span-2' : 'bg-surface',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted">{role.organization}</p>
        {role.periodLabel && <span className="rounded-full border hairline px-2.5 py-0.5 font-mono text-[11px] text-subtle">{role.periodLabel}</span>}
      </div>
      <h3 className={cn('mt-3 font-semibold tracking-tight text-ink', primary ? 'text-3xl sm:text-4xl' : 'text-2xl')}>{role.role}</h3>
      {role.summary && <p className="mt-3 max-w-2xl text-pretty text-muted">{role.summary}</p>}

      {hasDetails && (
        <div className="mt-6 grid gap-6 border-t hairline pt-6 sm:grid-cols-2">
          {role.organizational.length > 0 && (
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-subtle">
                <Users className="h-3.5 w-3.5 text-violet" aria-hidden /> Organizational
              </p>
              <ul className="space-y-2 text-sm text-ink/90">
                {role.organizational.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {role.technical.length > 0 && (
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-subtle">
                <Cpu className="h-3.5 w-3.5 text-cyan" aria-hidden /> Technical
              </p>
              <ul className="space-y-2 text-sm text-ink/90">
                {role.technical.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.article>
  );
}

export function Leadership() {
  const { data, isLoading, isError, error, refetch } = useLeadership();

  return (
    <section id="leadership" aria-labelledby="leadership-title" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10 bg-surface/40" />
      <div className="container">
        <SectionHeading
          id="leadership-title"
          eyebrow="Leadership & community"
          title={<>Organizing people, <Accent>not only code</Accent>.</>}
          description="Student engineering communities where I take on organizational responsibility and stay involved in technical activities."
        />

        {isLoading && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Skeleton className="h-64 lg:col-span-2" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        )}
        {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}
        {data && data.length === 0 && <EmptyState title="No leadership roles added yet." />}
        {data && data.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {data.map((role, i) => (
              <RoleCard key={role.id} role={role} index={i} primary={i === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
