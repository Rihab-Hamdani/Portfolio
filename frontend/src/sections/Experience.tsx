import { ArrowUpRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accent, SectionHeading } from '@/components/SectionHeading';
import { motion } from 'framer-motion';
import { TechChip } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useExperience } from '@/hooks/usePublicContent';

export function Experience() {
  const { data, isLoading, isError, error, refetch } = useExperience();

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading id="experience-title" eyebrow="Experience" title={<>Professional <Accent>experience</Accent></>} />

        {isLoading && <Skeleton className="h-56" />}
        {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}
        {data && data.length === 0 && <EmptyState title="No experience added yet." />}

        {data && data.length > 0 && (
          <ol className="relative space-y-8 border-l hairline pl-6 sm:pl-10">
            {data.map((item, i) => (
              <motion.li
                key={item.id}
                className="relative"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
              >
                  <span className="absolute -left-[33px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-accent bg-bg sm:-left-[49px]" aria-hidden>
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  <article className="card p-6 sm:p-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="flex items-center gap-2 text-sm font-medium text-accent">
                          <Briefcase className="h-4 w-4" aria-hidden /> {item.organization}
                          {item.employmentType && <span className="text-subtle">· {item.employmentType}</span>}
                        </p>
                        <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{item.role}</h3>
                      </div>
                      {(item.periodLabel || item.location) && (
                        <p className="font-mono text-xs text-subtle sm:text-right">
                          {item.periodLabel}
                          {item.periodLabel && item.location && <br />}
                          {item.location}
                        </p>
                      )}
                    </div>
                    {item.summary && <p className="mt-4 text-muted">{item.summary}</p>}
                    {item.responsibilities.length > 0 && (
                      <ul className="mt-5 space-y-2 text-sm text-muted">
                        {item.responsibilities.map((r) => (
                          <li key={r} className="flex gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-6 flex flex-col gap-4 border-t hairline pt-5 sm:flex-row sm:items-center sm:justify-between">
                      {item.technologies.length > 0 && (
                        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                          {item.technologies.map((t) => (
                            <li key={t}>
                              <TechChip>{t}</TechChip>
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.projectSlug && (
                        <Link to={`/projects/${item.projectSlug}`} className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-accent">
                          View project <ArrowUpRight className="h-4 w-4" aria-hidden />
                        </Link>
                      )}
                    </div>
                  </article>
              </motion.li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
