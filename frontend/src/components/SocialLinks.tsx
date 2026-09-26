import { Mail } from 'lucide-react';
import { site } from '@/config/site';
import { track } from '@/hooks/useAnalytics';
import { cn } from '@/utils/cn';
import { GithubIcon, LinkedinIcon } from './icons/BrandIcons';

/** Only renders links that are configured — nothing is invented. */
export function SocialLinks({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  const links = [
    site.githubUrl && { href: site.githubUrl, label: 'GitHub', icon: GithubIcon, event: 'github_click' as const },
    site.linkedinUrl && { href: site.linkedinUrl, label: 'LinkedIn', icon: LinkedinIcon, event: 'linkedin_click' as const },
    site.email && { href: `mailto:${site.email}`, label: 'Email', icon: Mail, event: undefined },
  ].filter(Boolean) as { href: string; label: string; icon: typeof Mail; event?: 'github_click' | 'linkedin_click' }[];

  if (links.length === 0) return null;
  const box = size === 'sm' ? 'h-9 w-9' : 'h-10 w-10';

  return (
    <ul className={cn('flex items-center gap-2', className)}>
      {links.map(({ href, label, icon: Icon, event }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            onClick={() => event && track(event)}
            className={cn(
              'grid place-items-center rounded-xl border hairline bg-surface/60 text-muted transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-ink',
              box,
            )}
          >
            <Icon className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
