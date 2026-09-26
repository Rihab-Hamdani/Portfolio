import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useActiveSection } from '@/hooks/useActiveSection';
import { cn } from '@/utils/cn';
import { ThemeToggle } from './ThemeToggle';

export const NAV_ITEMS = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'contact', label: 'Contact' },
];

export function Navbar() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useActiveSection(NAV_ITEMS.map((i) => i.id), onHome);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        open ? 'border-b hairline bg-bg' : scrolled ? 'border-b hairline bg-bg/75 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <nav className="container flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link to="/" className="group flex items-center gap-2.5" aria-label="Rihab Hamdani — home">
          <span className="gradient-border grid h-8 w-8 place-items-center rounded-[10px] bg-surface font-serif text-[15px] italic text-ink">
            rh
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink">Rihab Hamdani</span>
        </Link>

        <ul className="hidden items-center gap-1 rounded-full border hairline bg-surface/50 p-1 backdrop-blur lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = onHome && active === item.id;
            return (
              <li key={item.id} className="relative">
                <a
                  href={href(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative z-10 block rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                    isActive ? 'text-ink' : 'text-muted hover:text-ink',
                  )}
                >
                  {item.label}
                </a>
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-surface shadow-soft ring-1 ring-inset ring-line/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-xl border hairline bg-surface/60 text-ink lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100dvh - 4rem)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <motion.ul
              className="container flex flex-col gap-1 pb-10 pt-4"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
            >
              {NAV_ITEMS.map((item, index) => (
                <motion.li key={item.id} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}>
                  <a
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex items-baseline gap-4 rounded-2xl px-3 py-3 text-2xl font-semibold tracking-tight transition-colors',
                      onHome && active === item.id ? 'text-ink' : 'text-muted hover:text-ink',
                    )}
                  >
                    <span className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, '0')}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
