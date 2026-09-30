import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ExternalLink, FlaskConical, Lightbulb, Target, Wrench } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArchitectureFlow } from '@/components/ArchitectureFlow';
import { GithubIcon } from '@/components/icons/BrandIcons';
import { ProjectStatusBadge } from '@/components/ProjectCard';
import { Reveal } from '@/components/Reveal';
import { WakingUpNotice } from '@/components/WakingUpNotice';
import { ScreenshotGallery } from '@/components/ScreenshotGallery';
import { TechChip } from '@/components/ui/Badge';
import { buttonClass } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { track } from '@/hooks/useAnalytics';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useProject, useProjects } from '@/hooks/usePublicContent';
import NotFoundPage from './NotFoundPage';

function Block({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="border-t hairline py-12 sm:py-16"
    >
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">{title}</h2>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </motion.section>
  );
}

function BulletList({ items, color = 'bg-accent' }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-pretty leading-relaxed text-muted">
          <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${color}`} aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ProjectPage() {
  const { slug = '' } = useParams();
  const { data: project, isLoading, isError, error, refetch } = useProject(slug);
  const { data: all } = useProjects();

  useDocumentMeta({ title: project?.title, description: project?.tagline || project?.summary, path: `/projects/${slug}` });

  useEffect(() => {
    if (project) track('project_view', { projectSlug: project.slug });
  }, [project]);

  useEffect(() => window.scrollTo({ top: 0 }), [slug]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl space-y-6 pb-24 pt-32">
        <WakingUpNotice active />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError && error.status === 404) {
    return <NotFoundPage title="Project not found" message="This project doesn't exist or isn't published yet." />;
  }

  if (isError || !project) {
    return (
      <div className="container max-w-3xl pb-24 pt-32">
        <ErrorState message={error?.message ?? 'Could not load this project.'} onRetry={() => refetch()} />
      </div>
    );
  }

  const index = all?.findIndex((p) => p.slug === project.slug) ?? -1;
  const next = all && all.length > 1 && index >= 0 ? all[(index + 1) % all.length] : undefined;
  const isInternship = project.contribution.length > 0;

  return (
    <article className="pb-16 pt-28 sm:pt-32">
      {/* Header */}
      <header className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[520px] bg-[radial-gradient(50%_60%_at_30%_0%,rgb(var(--accent)/0.14),transparent_70%)]" />
        <div className="container max-w-5xl">
          <Link to="/#projects" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden /> All projects
          </Link>
          <Reveal className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <ProjectStatusBadge status={project.status} />
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">{project.title}</h1>
            {project.tagline && <p className="mt-5 max-w-3xl text-pretty text-lg text-muted sm:text-xl">{project.tagline}</p>}

            <div className="mt-8 flex flex-col gap-6 border-t hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
              {project.technologies.length > 0 && (
                <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                  {project.technologies.map((t) => (
                    <li key={t}>
                      <TechChip>{t}</TechChip>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex shrink-0 gap-2">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('github_click', { projectSlug: project.slug })} className={buttonClass('secondary', 'sm')}>
                    <GithubIcon className="h-3.5 w-3.5" /> Source
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('primary', 'sm')}>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Live demo
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="container mt-12 max-w-5xl">
        <Block eyebrow="Overview" title="What it is">
          <p className="text-pretty text-lg leading-relaxed text-ink/90">{project.summary}</p>
          {project.context && <p className="mt-4 text-pretty leading-relaxed text-muted">{project.context}</p>}
          {project.myRole && (
            <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/[0.04] p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-accent">My role</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{project.myRole}</p>
            </div>
          )}
        </Block>

        {(project.problem || project.solution) && (
          <Block eyebrow="Problem → Solution" title="Why it exists">
            <div className="grid gap-4 md:grid-cols-2">
              {project.problem && (
                <div className="card p-6">
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Target className="h-4 w-4 text-warning" aria-hidden /> Problem
                  </p>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div className="card p-6">
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Lightbulb className="h-4 w-4 text-success" aria-hidden /> {project.status === 'RESEARCH' ? 'Proposed solution' : 'Solution'}
                  </p>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">{project.solution}</p>
                </div>
              )}
            </div>
          </Block>
        )}

        {project.contribution.length > 0 && (
          <Block eyebrow="Scope" title="My contribution">
            <BulletList items={project.contribution} />
            <p className="mt-6 rounded-xl border hairline bg-surface-2/40 px-4 py-3 text-sm text-muted">
              The rest of the platform (backend services and infrastructure) was built by the wider team and is described below only as context.
            </p>
          </Block>
        )}

        {(project.architectureSteps.length > 0 || project.architectureDescription) && (
          <Block eyebrow="Architecture" title={project.status === 'RESEARCH' ? 'Technical direction' : isInternship ? 'Broader platform' : 'How it fits together'}>
            {project.architectureDescription && <p className="mb-6 text-pretty leading-relaxed text-muted">{project.architectureDescription}</p>}
            <div className="rounded-2xl border hairline bg-surface-2/30 p-4 sm:p-6">
              <ArchitectureFlow steps={project.architectureSteps} />
            </div>
          </Block>
        )}

        {project.features.length > 0 && (
          <Block eyebrow="Features" title="Key features">
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {project.features.map((f) => (
                <li key={f} className="flex items-center gap-3 rounded-xl border hairline bg-surface px-4 py-3 text-sm text-ink">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-cyan" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </Block>
        )}

        {project.screenshots.length > 0 && (
          <Block eyebrow="Screens" title="Screenshots">
            <ScreenshotGallery screenshots={project.screenshots} title={project.title} />
          </Block>
        )}

        {project.researchQuestions.length > 0 && (
          <Block eyebrow="Research" title="Open questions">
            <ol className="space-y-3">
              {project.researchQuestions.map((q, i) => (
                <li key={q} className="flex gap-4 rounded-xl border hairline bg-surface p-4">
                  <span className="font-mono text-xs text-violet">Q{i + 1}</span>
                  <span className="text-sm leading-relaxed text-ink">{q}</span>
                </li>
              ))}
            </ol>
          </Block>
        )}

        {project.challenges.length > 0 && (
          <Block eyebrow="Engineering" title={project.status === 'RESEARCH' ? 'Validation & risks' : 'Engineering considerations'}>
            <div className="flex gap-3">
              <Wrench className="mt-1 hidden h-4 w-4 shrink-0 text-subtle sm:block" aria-hidden />
              <BulletList items={project.challenges} color="bg-violet" />
            </div>
          </Block>
        )}

        {project.learnings.length > 0 && (
          <Block eyebrow="Takeaways" title="What I learned">
            <div className="flex gap-3">
              <FlaskConical className="mt-1 hidden h-4 w-4 shrink-0 text-subtle sm:block" aria-hidden />
              <BulletList items={project.learnings} color="bg-cyan" />
            </div>
          </Block>
        )}

        {next && next.slug !== project.slug && (
          <Reveal className="mt-8 border-t hairline pt-10">
            <p className="font-mono text-[11px] uppercase tracking-wider text-subtle">Next project</p>
            <Link to={`/projects/${next.slug}`} className="group mt-3 flex items-center justify-between gap-4">
              <span className="text-2xl font-semibold tracking-tight text-ink transition group-hover:text-accent sm:text-3xl">{next.title}</span>
              <ArrowUpRight className="h-6 w-6 shrink-0 text-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
            </Link>
          </Reveal>
        )}
      </div>
    </article>
  );
}
