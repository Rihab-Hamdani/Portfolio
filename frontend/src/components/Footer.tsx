import { Download } from 'lucide-react';
import { site } from '@/config/site';
import { useResume } from '@/hooks/useResume';
import { track } from '@/hooks/useAnalytics';

export function Footer() {
  const { download } = useResume();
  const links = [
    site.githubUrl && { label: 'GitHub', href: site.githubUrl, onClick: () => track('github_click') },
    site.linkedinUrl && { label: 'LinkedIn', href: site.linkedinUrl, onClick: () => track('linkedin_click') },
    site.email && { label: 'Email', href: `mailto:${site.email}` },
  ].filter(Boolean) as { label: string; href: string; onClick?: () => void }[];

  return (
    <footer className="border-t hairline">
      <div className="container flex flex-col gap-8 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-base font-semibold text-ink">Rihab Hamdani</p>
          <p className="mt-1 text-sm text-muted">Software Engineering Student</p>
        </div>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                onClick={link.onClick}
                className="text-muted transition hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button type="button" onClick={download} className="inline-flex items-center gap-1.5 text-muted transition hover:text-ink">
              <Download className="h-3.5 w-3.5" aria-hidden /> Resume
            </button>
          </li>
        </ul>
      </div>
      <div className="container flex flex-col gap-1 border-t hairline py-6 font-mono text-[11px] text-subtle sm:flex-row sm:justify-between">
        <p>© 2026 Rihab Hamdani</p>
        <p>Built with React + Spring Boot</p>
      </div>
    </footer>
  );
}
