import { Accent, SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';

const INTERESTS = ['Software Engineering', 'Full-Stack Development', 'Backend & APIs', 'AI / ML', 'Cloud', 'DevOps'];
const LOOKING_FOR = ['Software engineering internships', 'Full-stack / backend / frontend internships', 'PFE — final-year internship', 'AI/ML and Cloud/DevOps opportunities'];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 sm:py-28">
      <div className="container">
        <SectionHeading id="about-title" eyebrow="About" title={<>From an idea to <Accent>working software</Accent>.</>} />
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <Reveal className="space-y-5 text-pretty text-base leading-relaxed text-muted sm:text-[17px]">
            <p>
              I&apos;m a third-year Licence student in <span className="text-ink">Génie Logiciel et Systèmes d&apos;Information (GLSI)</span> at ISI
              Mahdia, in Tunisia. What I enjoy most is taking an idea and turning it into an application that actually works — with a
              real database behind it, an API that makes sense, and an interface people can use.
            </p>
            <p>
              Most of my projects cross the whole stack. I&apos;ve built a stock-management PWA for a medical cabinet with Angular, Spring Boot
              and PostgreSQL, worked on the frontend of a transport and expedition platform during my internship at MajraDeep, and built
              AI applications that combine LLM APIs with vector search.
            </p>
            <p>
              I&apos;m now looking to go deeper into backend engineering, APIs, AI/ML, cloud and DevOps — and to keep learning from engineers
              who build software that people rely on.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="card gradient-border space-y-6 p-6 sm:p-7">
            <div>
              <p className="eyebrow mb-3">Interested in</p>
              <ul className="flex flex-wrap gap-2">
                {INTERESTS.map((i) => (
                  <li key={i} className="rounded-full border hairline bg-surface-2/60 px-3 py-1 text-xs text-ink">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t hairline pt-6">
              <p className="eyebrow mb-3">Open to</p>
              <ul className="space-y-2 text-sm text-muted">
                {LOOKING_FOR.map((i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
