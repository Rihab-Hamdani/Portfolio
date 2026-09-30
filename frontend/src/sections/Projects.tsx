import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProjectCard, ProjectStatusBadge } from '@/components/ProjectCard';
import { Accent, SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { WakingUpNotice } from '@/components/WakingUpNotice';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useProjects } from '@/hooks/usePublicContent';


export function Projects() {
  const { data, isLoading, isError, error, refetch } = useProjects();
  const featured = (data ?? []).filter((p) => p.featured);
  const more = (data ?? []).filter((p) => !p.featured);
  const [lead, ...rest] = featured;

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          id="projects-title"
          eyebrow="Featured projects"
          title={<>Built as <Accent>products</Accent>, documented as case studies.</>}
          description="Each project covers the problem, the architecture, the key features and what I'm still working on. Status labels are honest: some are in active development or research."
        />

        <WakingUpNotice active={isLoading} />
        {isLoading && (
          <div className="grid gap-5 lg:grid-cols-2">
            <Skeleton className="h-72 lg:col-span-2" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        )}

        {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}

        {data && data.length === 0 && <EmptyState title="No projects available yet." description="Projects will appear here once they are published." />}

        {lead && (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="lg:col-span-2">
              <ProjectCard project={lead} index={0} large />
            </div>
            {rest.map((project, i) => (
              <div key={project.id} className={rest.length % 2 === 1 && i === rest.length - 1 ? 'lg:col-span-2' : undefined}>
                <ProjectCard project={project} index={i + 1} />
              </div>
            ))}
          </div>
        )}

        {more.length > 0 && (
          <Reveal className="mt-12">
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">More experiments</h3>
            <ul className="divide-y rounded-2xl border hairline bg-surface [&>li]:border-line/10">
              {more.map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="group flex flex-col gap-2 px-5 py-4 transition hover:bg-surface-2/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-ink">{project.title}</p>
                      {project.tagline && <p className="text-sm text-muted">{project.tagline}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <ProjectStatusBadge status={project.status} />
                      <ArrowUpRight className="h-4 w-4 text-subtle transition group-hover:text-ink" aria-hidden />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
