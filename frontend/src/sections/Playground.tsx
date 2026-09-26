import { AnimatePresence, motion } from 'framer-motion';
import { Code2, Database, Network, Terminal } from 'lucide-react';
import { useState } from 'react';
import { ApiExplorer } from '@/components/playground/ApiExplorer';
import { ArchitectureVisualizer } from '@/components/playground/ArchitectureVisualizer';
import { CodeSnippets } from '@/components/playground/CodeSnippets';
import { DataModel } from '@/components/playground/DataModel';
import { Accent, SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/utils/cn';

const TABS = [
  { id: 'api', label: 'API Explorer', icon: Terminal, Component: ApiExplorer },
  { id: 'data', label: 'Data model', icon: Database, Component: DataModel },
  { id: 'arch', label: 'Architecture', icon: Network, Component: ArchitectureVisualizer },
  { id: 'code', label: 'Code', icon: Code2, Component: CodeSnippets },
] as const;

/** Loaded lazily: this section ships in its own chunk. */
export default function Playground() {
  const [active, setActive] = useState<(typeof TABS)[number]['id']>('api');
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <section id="playground" aria-labelledby="playground-title" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          id="playground-title"
          eyebrow="Technical playground"
          title={<>Look <Accent>under the hood</Accent> of this site.</>}
          description="This portfolio is itself a full-stack application. Call its real API, explore its database schema, and see how the layers talk to each other."
        />
        <Reveal className="card overflow-hidden">
          <div role="tablist" aria-label="Playground" className="flex gap-1 overflow-x-auto border-b hairline bg-surface-2/40 p-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`pg-tab-${t.id}`}
                aria-selected={active === t.id}
                aria-controls="pg-panel"
                onClick={() => setActive(t.id)}
                className={cn(
                  'relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors',
                  active === t.id ? 'text-ink' : 'text-muted hover:text-ink',
                )}
              >
                {active === t.id && <motion.span layoutId="pg-tab" className="absolute inset-0 rounded-xl bg-surface shadow-soft" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <t.icon className="relative h-4 w-4" aria-hidden />
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
          <div id="pg-panel" role="tabpanel" aria-labelledby={`pg-tab-${active}`} className="p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <tab.Component />
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
