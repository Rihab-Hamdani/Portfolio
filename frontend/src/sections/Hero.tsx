import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { fadeUp, stagger } from '@/animations/variants';
import { Accent } from '@/components/SectionHeading';
import { HeroVisual } from '@/components/HeroVisual';
import { SocialLinks } from '@/components/SocialLinks';
import { Button, buttonClass } from '@/components/ui/Button';
import { useResume } from '@/hooks/useResume';

export function Hero() {
  const { download, checking } = useResume();

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(60%_50%_at_50%_0%,rgb(var(--accent)/0.12),transparent_70%)]" />
      <div className="container grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <motion.div variants={stagger(0.09, 0.05)} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border hairline bg-surface/60 py-1 pl-1.5 pr-3 text-xs text-muted backdrop-blur">
            <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent">GLSI</span>
            3rd-year Software Engineering student · ISI Mahdia
          </motion.p>

          <motion.h1 id="hero-title" variants={fadeUp} className="text-balance text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.1rem]">
            Rihab Hamdani
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 text-balance text-2xl font-medium leading-snug tracking-tight text-ink/90 sm:text-3xl">
            Software Engineering Student building <Accent>full-stack</Accent> &amp; <Accent>AI-powered</Accent> applications.
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            I build practical software products end to end: interfaces in Angular and React, REST APIs with Spring Boot and FastAPI,
            relational and vector databases, and features powered by LLM APIs.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a href="#projects" className={buttonClass('primary', 'lg')}>
              View Projects <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="#contact" className={buttonClass('secondary', 'lg')}>
              Contact Me
            </a>
            <Button variant="ghost" size="lg" onClick={download} loading={checking} icon={<Download className="h-4 w-4" aria-hidden />}>
              Download Resume
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-9">
            <SocialLinks />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}
