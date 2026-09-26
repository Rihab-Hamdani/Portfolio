import { Briefcase, GraduationCap, Users } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

const FACTS = [
  { icon: GraduationCap, label: 'Education', value: 'Licence in GLSI, 3rd year', detail: 'ISI Mahdia, Tunisia' },
  { icon: Briefcase, label: 'Internship', value: 'Frontend / Software Development Intern', detail: 'MajraDeep · Hezly platform' },
  { icon: Users, label: 'Leadership', value: 'General Secretary', detail: 'IEEE ISIMA Student Branch · 2025–2026' },
];

const STACK = ['Java', 'Spring Boot', 'Angular', 'React', 'TypeScript', 'PostgreSQL', 'FastAPI', 'Qdrant', 'Docker', 'Flyway'];

export function Credibility() {
  return (
    <section aria-label="At a glance" className="border-y hairline bg-surface/40">
      <div className="container py-10">
        <Reveal className="grid gap-6 sm:grid-cols-3">
          {FACTS.map(({ icon: Icon, label, value, detail }) => (
            <div key={label} className="flex gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border hairline bg-surface text-accent">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
                <p className="text-xs text-muted">{detail}</p>
              </div>
            </div>
          ))}
        </Reveal>
        <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t hairline pt-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Across my projects</span>
          <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
            {STACK.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
