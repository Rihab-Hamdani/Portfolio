import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { TechIcon } from '@/components/icons/TechIcon';
import { Accent, SectionHeading } from '@/components/SectionHeading';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useSkills } from '@/hooks/usePublicContent';
import type { SkillCategory } from '@/types';
import { cn } from '@/utils/cn';
import { SKILL_CATEGORY_LABELS } from '@/utils/project';

type Filter = 'ALL' | SkillCategory;
const ORDER: SkillCategory[] = ['LANGUAGES', 'FRONTEND', 'BACKEND', 'DATABASES', 'AI', 'TOOLS'];

export function Skills() {
  const { data, isLoading, isError, error, refetch } = useSkills();
  const [filter, setFilter] = useState<Filter>('ALL');

  const categories = useMemo(() => ORDER.filter((c) => data?.some((s) => s.category === c)), [data]);
  const visible = useMemo(
    () =>
      (data ?? [])
        .filter((s) => filter === 'ALL' || s.category === filter)
        .sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category) || a.displayOrder - b.displayOrder),
    [data, filter],
  );
  const groups = useMemo(
    () =>
      (filter === 'ALL' ? categories : [filter]).map((c) => [c, visible.filter((s) => s.category === c)] as const).filter(([, items]) => items.length > 0),
    [categories, filter, visible],
  );

  return (
    <section id="skills" aria-labelledby="skills-title" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills"
          title={<>Tools I have <Accent>actually used</Accent>.</>}
          description="Grouped by area, with a note on how I use each one. No percentages: skill is better shown in the projects."
        />

        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        )}
        {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}
        {data && data.length === 0 && <EmptyState title="No skills added yet." />}

        {data && data.length > 0 && (
          <>
            <div role="group" aria-label="Filter skills by category" className="mb-8 flex flex-wrap gap-2">
              {(['ALL', ...categories] as Filter[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={filter === c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    'relative rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                    filter === c ? 'text-bg dark:text-slate-900' : 'border hairline text-muted hover:text-ink',
                  )}
                >
                  {filter === c && <motion.span layoutId="skill-filter" className="absolute inset-0 rounded-full bg-ink dark:bg-white" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                  <span className="relative">{c === 'ALL' ? 'All' : SKILL_CATEGORY_LABELS[c]}</span>
                </button>
              ))}
            </div>

            <div className="space-y-10">
              {groups.map(([category, skills]) => (
                <div key={category}>
                  {filter === 'ALL' && (
                    <h3 className="mb-3 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
                      {SKILL_CATEGORY_LABELS[category]}
                      <span className="h-px flex-1 bg-line/10" aria-hidden />
                    </h3>
                  )}
                  <motion.ul layout className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <AnimatePresence mode="popLayout">
                      {skills.map((skill) => (
                        <motion.li
                          key={skill.id}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.25 }}
                          className="group flex gap-3.5 rounded-2xl border hairline bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-soft"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted transition group-hover:bg-accent/10 group-hover:text-accent">
                            <TechIcon name={skill.icon} className="h-[18px] w-[18px]" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-ink">{skill.name}</p>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-subtle">{SKILL_CATEGORY_LABELS[skill.category]}</p>
                            {skill.description && <p className="mt-1.5 text-[13px] leading-snug text-muted">{skill.description}</p>}
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
