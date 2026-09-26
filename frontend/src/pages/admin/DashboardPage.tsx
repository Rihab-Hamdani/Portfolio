import { useQuery } from '@tanstack/react-query';
import { ArrowRight, BarChart3, Briefcase, FolderKanban, Inbox, Users, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/api/endpoints';
import { PageHeader, StatCard } from '@/components/admin/AdminUi';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatNumber } from '@/utils/format';

export default function DashboardPage() {
  const { user } = useAuth();
  const overview = useQuery({ queryKey: ['admin', 'overview'], queryFn: adminApi.overview });
  const messages = useQuery({ queryKey: ['admin', 'messages', 'recent'], queryFn: () => adminApi.messages({ size: 5 }) });

  return (
    <>
      <PageHeader title={`Welcome back${user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}`} description="Everything below comes from the database — no placeholder numbers." />

      {overview.isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}
      {overview.isError && <ErrorState message={overview.error.message} onRetry={() => overview.refetch()} />}
      {overview.data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Projects" value={overview.data.projects} hint={`${overview.data.publishedProjects} published`} icon={<FolderKanban className="h-4 w-4" />} />
          <StatCard label="Messages" value={overview.data.messages} hint={`${overview.data.unreadMessages} new`} icon={<Inbox className="h-4 w-4" />} />
          <StatCard
            label="Events (30 days)"
            value={overview.data.eventsLast30Days === 0 ? '—' : formatNumber(overview.data.eventsLast30Days)}
            hint={overview.data.eventsLast30Days === 0 ? 'No data yet' : 'Tracked events'}
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <StatCard
            label="Content"
            value={overview.data.experiences + overview.data.leadershipRoles + overview.data.skills}
            hint={`${overview.data.experiences} experience · ${overview.data.leadershipRoles} leadership · ${overview.data.skills} skills`}
            icon={<Briefcase className="h-4 w-4" />}
          />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-5" aria-labelledby="recent-messages">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-messages" className="text-sm font-semibold text-ink">
              Recent messages
            </h2>
            <Link to="/admin/messages" className="inline-flex items-center gap-1 text-xs text-muted hover:text-ink">
              All messages <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
          {messages.isLoading && <Skeleton className="h-40" />}
          {messages.isError && <ErrorState message={messages.error.message} onRetry={() => messages.refetch()} />}
          {messages.data && messages.data.items.length === 0 && <EmptyState title="No messages yet." description="Messages sent through the contact form will appear here." />}
          {messages.data && messages.data.items.length > 0 && (
            <ul className="divide-y divide-line/10">
              {messages.data.items.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{m.subject}</p>
                    <p className="truncate text-xs text-muted">
                      {m.name} · {m.email}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {m.status === 'NEW' && <Badge tone="accent">New</Badge>}
                    <p className="mt-1 text-[11px] text-subtle">{formatDate(m.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5" aria-labelledby="quick-links">
          <h2 id="quick-links" className="mb-4 text-sm font-semibold text-ink">
            Manage content
          </h2>
          <ul className="space-y-1">
            {[
              { to: '/admin/projects/new', label: 'Add a project', icon: FolderKanban },
              { to: '/admin/experience', label: 'Edit experience', icon: Briefcase },
              { to: '/admin/leadership', label: 'Edit leadership roles', icon: Users },
              { to: '/admin/skills', label: 'Edit skills', icon: Wrench },
              { to: '/admin/analytics', label: 'View analytics', icon: BarChart3 },
            ].map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link to={to} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-surface-2/60 hover:text-ink">
                  <Icon className="h-4 w-4" aria-hidden /> {label}
                  <ArrowRight className="ml-auto h-3.5 w-3.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
