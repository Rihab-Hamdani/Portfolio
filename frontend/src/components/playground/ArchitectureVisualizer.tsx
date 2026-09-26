import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Database, Monitor, Server } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/utils/cn';

type LayerId = 'frontend' | 'backend' | 'database' | 'ai';

const LAYERS: Array<{
  id: LayerId;
  label: string;
  icon: typeof Monitor;
  tech: string[];
  talksTo: LayerId[];
  flow: string[];
  where: string;
}> = [
  {
    id: 'frontend',
    label: 'Frontend',
    icon: Monitor,
    tech: ['React + TypeScript (this site)', 'Angular 18 (Medical Cabinet PWA, Hezly)', 'TanStack Query · Axios'],
    talksTo: ['backend'],
    flow: ['User action', 'Client-side validation', 'HTTP request (JSON)', 'Cache + render response'],
    where: 'Renders state, validates early, and never trusts itself for security: permissions are always enforced by the API.',
  },
  {
    id: 'backend',
    label: 'Backend',
    icon: Server,
    tech: ['Spring Boot · Java 21 (this site, Medical Cabinet)', 'FastAPI (StudyMate AI)', 'Spring Security + JWT'],
    talksTo: ['frontend', 'database', 'ai'],
    flow: ['JWT filter', 'Controller + Bean Validation', 'Service (business rules)', 'Repository', 'Structured JSON / errors'],
    where: 'Owns business rules, authentication, authorization, validation and rate limiting.',
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    tech: ['PostgreSQL + Flyway (relational)', 'Qdrant (vector search)', 'MongoDB (NetAI-Monitor experiment)'],
    talksTo: ['backend'],
    flow: ['Versioned migration', 'Constraints & foreign keys', 'Indexes for the real queries', 'Transactions'],
    where: 'Protects data integrity with constraints; schema changes are versioned migrations, never manual edits.',
  },
  {
    id: 'ai',
    label: 'AI',
    icon: Brain,
    tech: ['LLM APIs', 'Vector storage in Qdrant', 'Document processing (StudyMate AI)'],
    talksTo: ['backend', 'database'],
    flow: ['PDF upload', 'Document processing', 'Vector storage', 'LLM API with context', 'Response to the UI'],
    where: 'Called from the backend, never directly from the browser, so keys stay server-side.',
  },
];

export function ArchitectureVisualizer() {
  const [active, setActive] = useState<LayerId>('backend');
  const layer = LAYERS.find((l) => l.id === active)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="relative grid grid-cols-2 gap-3" role="group" aria-label="Architecture layers">
        {LAYERS.map((l) => {
          const connected = layer.talksTo.includes(l.id);
          const isActive = l.id === active;
          return (
            <button
              key={l.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(l.id)}
              className={cn(
                'relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all',
                isActive ? 'border-accent/50 bg-surface shadow-glow' : connected ? 'border-cyan/40 bg-surface' : 'hairline bg-surface/50 opacity-70 hover:opacity-100',
              )}
            >
              <span className={cn('grid h-9 w-9 place-items-center rounded-xl', isActive ? 'bg-accent/15 text-accent' : 'bg-surface-2 text-muted')}>
                <l.icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-ink">{l.label}</span>
              {connected && !isActive && <span className="absolute right-3 top-3 rounded-full bg-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan">connected</span>}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">{layer.where}</p>
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-subtle">Used in my projects</p>
            <ul className="space-y-1.5 text-sm text-ink">
              {layer.tech.map((t) => (
                <li key={t} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-subtle">Request path</p>
            <ol className="flex flex-wrap items-center gap-1.5">
              {layer.flow.map((f, i) => (
                <li key={f} className="flex items-center gap-1.5">
                  <span className="rounded-lg border hairline bg-surface-2/50 px-2 py-1 font-mono text-[11px] text-ink">{f}</span>
                  {i < layer.flow.length - 1 && <span className="text-subtle" aria-hidden>→</span>}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
