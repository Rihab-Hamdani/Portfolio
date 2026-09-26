import { lazy, Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { About } from '@/sections/About';
import { Contact } from '@/sections/Contact';
import { Credibility } from '@/sections/Credibility';
import { Experience } from '@/sections/Experience';
import { FinalCta } from '@/sections/FinalCta';
import { Hero } from '@/sections/Hero';
import { HowIBuild } from '@/sections/HowIBuild';
import { Leadership } from '@/sections/Leadership';
import { Projects } from '@/sections/Projects';
import { Skills } from '@/sections/Skills';

const Playground = lazy(() => import('@/sections/Playground'));

export default function HomePage() {
  useDocumentMeta({ path: '/' });
  const { hash } = useLocation();

  // Arriving from another page with /#section: scroll once the section exists.
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 120);
    return () => window.clearTimeout(timer);
  }, [hash]);

  return (
    <>
      <Hero />
      <Credibility />
      <About />
      <Projects />
      <HowIBuild />
      <Suspense
        fallback={
          <div className="container py-24">
            <Skeleton className="h-[520px]" />
          </div>
        }
      >
        <Playground />
      </Suspense>
      <Experience />
      <Leadership />
      <Skills />
      <FinalCta />
      <Contact />
    </>
  );
}
