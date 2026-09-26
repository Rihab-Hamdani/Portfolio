import { useQuery } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { adminApi } from '@/api/endpoints';
import { PageHeader, StatCard } from '@/components/admin/AdminUi';
import { DailyBarChart, HorizontalBars } from '@/components/admin/BarChart';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import type { AnalyticsEventType, AnalyticsSummary } from '@/types';
import { cn } from '@/utils/cn';
import { EVENT_LABELS, formatNumber } from '@/utils/format';

const RANGES = [7, 30, 90];
const TYPES: AnalyticsEventType[] = ['page_view', 'project_view', 'resume_download', 'contact_submit', 'github_click', 'linkedin_click'];

/** Fills missing days with 0 so the chart does not hide quiet days. */
function fillDays(summary: AnalyticsSummary) {
  const map = new Map(summary.daily.map((d) => [d.day, d.pageViews]));
  const days: { day: string; value: number }[] = [];
  const today = new Date();
  for (let i = summary.days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
    const key = d.toISOString().slice(0, 10);
    days.push({ day: key, value: map.get(key) ?? 0 });
  }
  return days;
}

export default function AnalyticsAdmin() {
  const [days, setDays] = useState(30);
  const query = useQuery({ queryKey: ['admin', 'analytics', days], queryFn: () => adminApi.analytics(days) });
  const totals = useMemo(() => new Map(query.data?.byType.map((t) => [t.type, t.total])), [query.data]);
  const daily = useMemo(() => (query.data ? fillDays(query.data) : []), [query.data]);

  return (
    <>
      <PageHeader
        title="Analytics"
        description="First-party events stored by this site. No IP addresses, no cookies, and Do Not Track is respected."
        actions={
          <div className="flex rounded-xl border hairline p-1" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={days === r}
                onClick={() => setDays(r)}
                className={cn('rounded-lg px-3 py-1.5 text-xs font-medium', days === r ? 'bg-surface text-ink shadow-soft' : 'text-muted hover:text-ink')}
              >
                {r} days
              </button>
            ))}
          </div>
        }
      />

      {query.isLoading && <Skeleton className="h-96" />}
      {query.isError && <ErrorState message={query.error.message} onRetry={() => query.refetch()} />}

      {query.data && query.data.totalEvents === 0 && (
        <EmptyState icon={<BarChart3 className="h-5 w-5" />} title="No analytics data yet." description="Events will appear here as soon as people visit the portfolio. Nothing is estimated or simulated." />
      )}

      {query.data && query.data.totalEvents > 0 && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TYPES.map((t) => (
              <StatCard key={t} label={EVENT_LABELS[t]} value={formatNumber(totals.get(t) ?? 0)} hint={`Last ${days} days`} />
            ))}
          </div>

          <section className="card p-5" aria-labelledby="daily-title">
            <h2 id="daily-title" className="text-sm font-semibold text-ink">
              Page views per day
            </h2>
            <p className="mb-4 text-xs text-subtle">UTC days · hover a bar for the exact value</p>
            <DailyBarChart data={daily} label="Page views" />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="card p-5" aria-labelledby="top-projects">
              <h2 id="top-projects" className="mb-4 text-sm font-semibold text-ink">
                Most viewed projects
              </h2>
              {query.data.topProjects.length === 0 ? (
                <p className="text-sm text-muted">No project views yet.</p>
              ) : (
                <HorizontalBars items={query.data.topProjects.map((p) => ({ label: p.title, value: p.total }))} />
              )}
            </section>
            <section className="card p-5" aria-labelledby="top-pages">
              <h2 id="top-pages" className="mb-4 text-sm font-semibold text-ink">
                Top pages
              </h2>
              {query.data.topPages.length === 0 ? (
                <p className="text-sm text-muted">No page views yet.</p>
              ) : (
                <HorizontalBars items={query.data.topPages.map((p) => ({ label: p.page, value: p.total }))} />
              )}
            </section>
          </div>
        </div>
      )}
    </>
  );
}
