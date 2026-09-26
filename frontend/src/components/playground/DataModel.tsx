import { useState } from 'react';
import { cn } from '@/utils/cn';

/** Simplified relational model of THIS portfolio's own PostgreSQL schema (see V1__init_schema.sql). */
const TABLES = [
  { id: 'projects', x: 20, y: 20, cols: ['id  uuid  PK', 'slug  varchar  UNIQUE', 'title  varchar', 'status  varchar', 'features  jsonb', 'published  boolean', 'display_order  int'] },
  { id: 'project_technologies', x: 330, y: 40, cols: ['project_id  uuid  FK', 'technology_id  uuid  FK', 'position  int'] },
  { id: 'technologies', x: 600, y: 20, cols: ['id  uuid  PK', 'name  varchar  UNIQUE'] },
  { id: 'analytics_events', x: 20, y: 250, cols: ['id  uuid  PK', 'event_type  varchar', 'page  varchar', 'project_id  uuid  FK', 'metadata  jsonb', 'occurred_at  timestamptz'] },
  { id: 'contact_messages', x: 330, y: 250, cols: ['id  uuid  PK', 'email  varchar', 'subject  varchar', 'status  varchar', 'created_at  timestamptz'] },
  { id: 'users', x: 600, y: 250, cols: ['id  uuid  PK', 'email  varchar  UNIQUE', 'password_hash  varchar', 'role  varchar'] },
];

const RELATIONS = [
  { from: 'project_technologies', to: 'projects', label: 'N : 1', d: 'M330 78 C 290 78, 290 70, 250 70', note: 'ON DELETE CASCADE' },
  { from: 'project_technologies', to: 'technologies', label: 'N : 1', d: 'M560 78 C 580 78, 580 60, 600 60', note: 'ON DELETE RESTRICT' },
  { from: 'analytics_events', to: 'projects', label: 'N : 1', d: 'M120 250 C 120 230, 120 215, 120 196', note: 'ON DELETE SET NULL' },
];

const WIDTH = 230;
const ROW = 20;

export function DataModel() {
  const [focus, setFocus] = useState<string | null>(null);
  const related = (id: string) => !focus || focus === id || RELATIONS.some((r) => (r.from === focus && r.to === id) || (r.to === focus && r.from === id));

  return (
    <div>
      <p className="mb-4 text-sm text-muted">
        The actual schema behind this site, simplified. Hover or focus a table to see its relations. Primary keys are UUIDs, list fields are JSONB,
        and every change goes through a versioned Flyway migration.
      </p>
      <div className="overflow-x-auto rounded-2xl border hairline bg-surface-2/30 p-2">
        <svg viewBox="0 0 850 420" className="min-w-[720px]" role="img" aria-label="Entity relationship diagram of the portfolio database">
          {RELATIONS.map((r) => {
            const on = !focus || focus === r.from || focus === r.to;
            return (
              <g key={`${r.from}-${r.to}`} opacity={on ? 1 : 0.15} className="transition-opacity">
                <path d={r.d} fill="none" stroke="rgb(var(--accent))" strokeWidth="1.5" strokeDasharray="4 3" />
              </g>
            );
          })}
          {TABLES.map((t) => {
            const h = 30 + t.cols.length * ROW + 8;
            const on = related(t.id);
            return (
              <g
                key={t.id}
                transform={`translate(${t.x} ${t.y})`}
                opacity={on ? 1 : 0.3}
                tabIndex={0}
                role="button"
                aria-label={`Table ${t.id}`}
                onMouseEnter={() => setFocus(t.id)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(t.id)}
                onBlur={() => setFocus(null)}
                className="cursor-default outline-none transition-opacity"
              >
                <rect width={WIDTH} height={h} rx="12" fill="rgb(var(--surface))" stroke={focus === t.id ? 'rgb(var(--accent))' : 'rgb(var(--line) / 0.25)'} />
                <rect width={WIDTH} height="30" rx="12" fill="rgb(var(--accent) / 0.08)" />
                <text x="14" y="20" className="fill-ink font-mono text-[12px] font-semibold">{t.id}</text>
                {t.cols.map((c, i) => {
                  const [name, type, flag] = c.split(/\s{2,}/);
                  return (
                    <g key={c} transform={`translate(14 ${46 + i * ROW})`}>
                      <text className={cn('font-mono text-[11px]', flag ? 'fill-ink' : 'fill-muted')}>{name}</text>
                      <text x="118" className="fill-subtle font-mono text-[10px]">{type}</text>
                      {flag && (
                        <text x={WIDTH - 28} textAnchor="end" className={cn('font-mono text-[9.5px] font-semibold', flag === 'PK' ? 'fill-accent' : flag === 'FK' ? 'fill-violet' : 'fill-cyan')}>
                          {flag}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] text-subtle">
        {RELATIONS.map((r) => (
          <li key={r.note + r.from + r.to}>
            {r.from} → {r.to} · {r.label} · {r.note}
          </li>
        ))}
      </ul>
    </div>
  );
}
