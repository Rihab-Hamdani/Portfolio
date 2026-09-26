import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Briefcase, ExternalLink, FolderKanban, Inbox, LayoutDashboard, LogOut, Menu, Users, Wrench, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/leadership', label: 'Leadership', icon: Users },
  { to: '/admin/skills', label: 'Skills', icon: Wrench },
  { to: '/admin/messages', label: 'Messages', icon: Inbox },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-full flex-col">
      <Link to="/admin" onClick={onNavigate} className="flex items-center gap-2.5 px-3 py-4">
        <span className="gradient-border grid h-8 w-8 place-items-center rounded-[10px] bg-surface font-serif text-[15px] italic text-ink">rh</span>
        <span>
          <span className="block text-sm font-semibold text-ink">Portfolio</span>
          <span className="block font-mono text-[10px] uppercase tracking-wider text-subtle">Admin</span>
        </span>
      </Link>
      <nav aria-label="Admin" className="mt-4 flex-1">
        <ul className="space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                    isActive ? 'bg-surface text-ink shadow-soft ring-1 ring-inset ring-line/10' : 'text-muted hover:bg-surface/60 hover:text-ink',
                  )
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-1 border-t hairline pt-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted hover:text-ink">
          <ExternalLink className="h-4 w-4" aria-hidden /> View site
        </a>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted hover:text-danger">
          <LogOut className="h-4 w-4" aria-hidden /> Sign out
        </button>
        {user && <p className="truncate px-3 pt-2 text-xs text-subtle">{user.email}</p>}
      </div>
    </div>
  );
}

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.title = 'Admin | Rihab Hamdani';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  return (
    <div className="min-h-dvh bg-bg">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r hairline bg-surface-2/40 px-3 pb-4 lg:block">
        <SidebarContent />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b hairline bg-bg/80 px-4 backdrop-blur lg:pl-64">
        <button type="button" className="grid h-9 w-9 place-items-center rounded-xl border hairline lg:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}>
          <Menu className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-muted lg:hidden">Admin</span>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-slate-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="absolute inset-y-0 left-0 w-64 border-r hairline bg-bg px-3 pb-4"
            >
              <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-4 rounded-lg p-1 text-subtle hover:text-ink" aria-label="Close navigation">
                <X className="h-4 w-4" />
              </button>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="px-4 py-8 sm:px-6 lg:ml-60 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
