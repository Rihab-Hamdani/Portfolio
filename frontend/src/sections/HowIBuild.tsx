import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Hammer, Layers3, RefreshCw, Rocket, Sparkles } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { Accent, SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/utils/cn';

const STEPS = [
  {
    title: 'Understand the problem',
    icon: Compass,
    body: 'Before any code: who uses this, what goes wrong today, and what "done" means. For the medical cabinet app that meant understanding how a doctor and a secretary actually handle stock during the day — often from a phone.',
    practice: ['Talk to users, list real scenarios', 'Write down roles and permissions early', 'Separate must-haves from nice-to-haves'],
  },
  {
    title: 'Design the architecture',
    icon: Layers3,
    body: 'Pick boundaries that fit the problem: a client, an API with clear contracts, a schema that protects data integrity. This portfolio follows the same idea — React talks to a Spring Boot REST API backed by PostgreSQL.',
    practice: ['Model the database first (constraints, keys, indexes)', 'Define API contracts and error formats', 'Version the schema with Flyway'],
  },
  {
    title: 'Build the core functionality',
    icon: Hammer,
    body: 'Get the main flow working end to end before polishing. Authentication, the main entities and their rules come first; secondary screens later.',
    practice: ['Vertical slices: UI → API → database', 'Validation on both client and server', 'Security rules enforced in the backend'],
  },
  {
    title: 'Test and iterate',
    icon: RefreshCw,
    body: 'Tests make changes safe. In this repository, controller, service and authentication tests run in CI on every push, alongside an integration test against a real PostgreSQL.',
    practice: ['Unit tests for business rules', 'Controller tests for security and errors', 'Integration tests for migrations and data'],
  },
  {
    title: 'Improve the user experience',
    icon: Sparkles,
    body: 'Loading states, empty states, clear error messages, keyboard navigation and mobile layouts are part of the product, not decoration.',
    practice: ['Design empty and error states on purpose', 'Respect reduced-motion and contrast', 'Test on small screens first'],
  },
  {
    title: 'Deploy and maintain',
    icon: Rocket,
    body: 'Reproducible environments with Docker, configuration through environment variables, health checks and a CI pipeline that fails fast when something breaks.',
    practice: ['Docker Compose for the full stack', 'No secrets in Git', 'CI: build → test → Docker build'],
  },
];

export function HowIBuild() {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const step = STEPS[active];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (event.key in keys) {
      event.preventDefault();
      const next = (active + keys[event.key] + STEPS.length) % STEPS.length;
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  return (
    <section id="engineering" aria-labelledby="engineering-title" className="relative py-20 sm:py-28">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
      <div className="container">
        <SectionHeading
          id="engineering-title"
          eyebrow="How I build"
          title={<>Engineering first, <Accent>interface</Accent> included.</>}
          description="The process I follow on my projects — from understanding the problem to running the software reliably."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div role="tablist" aria-label="Engineering process" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {STEPS.map((s, i) => (
              <button
                key={s.title}
                ref={(el) => (tabs.current[i] = el)}
                role="tab"
                id={`step-tab-${i}`}
                aria-selected={active === i}
                aria-controls="step-panel"
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                className={cn(
                  'group relative flex shrink-0 items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-all lg:shrink',
                  active === i ? 'border-accent/30 bg-surface shadow-soft' : 'hairline bg-transparent hover:bg-surface/60',
                )}
              >
                <span className={cn('font-mono text-xs', active === i ? 'text-accent' : 'text-subtle')}>{String(i + 1).padStart(2, '0')}</span>
                <span className={cn('whitespace-nowrap text-sm font-medium lg:whitespace-normal', active === i ? 'text-ink' : 'text-muted')}>{s.title}</span>
                {active === i && <motion.span layoutId="step-indicator" className="absolute inset-y-3 left-0 hidden w-[3px] rounded-full bg-gradient-to-b from-accent to-violet lg:block" />}
              </button>
            ))}
          </div>

          <div id="step-panel" role="tabpanel" aria-labelledby={`step-tab-${active}`} className="card gradient-border relative min-h-[320px] overflow-hidden p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <div className="mb-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent/15 to-violet/15 text-accent">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <p className="font-mono text-xs text-subtle">Step {String(active + 1).padStart(2, '0')} / 06</p>
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-3 text-pretty leading-relaxed text-muted">{step.body}</p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-1">
                  {step.practice.map((p) => (
                    <li key={p} className="flex items-center gap-3 rounded-xl border hairline bg-surface-2/40 px-4 py-2.5 text-sm text-ink">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
