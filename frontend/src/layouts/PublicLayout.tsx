import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { pageTransition } from '@/animations/variants';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { track } from '@/hooks/useAnalytics';

export function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    track('page_view', { page: location.pathname });
  }, [location.pathname]);

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <a href="#main" className="sr-only z-[70] rounded-lg bg-ink px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <motion.main id="main" key={location.pathname} variants={pageTransition} initial="initial" animate="enter" exit="exit">
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
}
