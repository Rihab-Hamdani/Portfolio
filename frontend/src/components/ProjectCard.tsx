import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProjectSummary } from '@/types';
import { STATUS_META } from '@/utils/project';
import { useSpotlight } from '@/hooks/useSpotlight';
import { cn } from '@/utils/cn';
import { Badge, TechChip } from './ui/Badge';

export function ProjectStatusBadge({ status }: { status?: ProjectSummary['status'] }) {
  if (!status) return null;
  const meta = STATUS_META[status];
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  );
}

export function ProjectCard({ project, index, large = false }: { project: ProjectSummary; index: number; large?: boolean }) {
  const onMouseMove = useSpotlight<HTMLElement>();
  const techs = project.technologies.slice(0, large ? 8 : 5);
  const hidden = project.technologies.length - techs.length;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMouseMove}
      className={cn(
        'card spotlight group relative flex h-full flex-col overflow-hidden p-6 transition-shadow duration-300 hover:shadow-lift sm:p-7',
        large && 'lg:p-9',
      )}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <span className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, '0')}</span>
        <ProjectStatusBadge status={project.status} />
      </div>

      <h3 className={cn('font-semibold tracking-tight text-ink', large ? 'text-2xl sm:text-3xl' : 'text-xl')}>
        <Link
          to={`/projects/${project.slug}`}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
        >
          {project.title}
        </Link>
      </h3>
      {project.tagline && <p className={cn('mt-2 text-muted', large ? 'text-base sm:text-lg' : 'text-sm')}>{project.tagline}</p>}
      {large && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{project.summary}</p>}

      <div className="mt-auto pt-6">
        {techs.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {techs.map((t) => (
              <li key={t}>
                <TechChip>{t}</TechChip>
              </li>
            ))}
            {hidden > 0 && (
              <li>
                <TechChip>+{hidden}</TechChip>
              </li>
            )}
          </ul>
        )}
        <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
          Read case study
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </p>
      </div>
    </motion.article>
  );
}
