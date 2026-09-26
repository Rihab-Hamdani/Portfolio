import { Mail, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { GithubIcon, LinkedinIcon } from '@/components/icons/BrandIcons';
import { Accent, SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { site } from '@/config/site';
import { track } from '@/hooks/useAnalytics';

export function Contact() {
  const channels = [
    site.email && { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
    site.linkedinUrl && { icon: LinkedinIcon, label: 'LinkedIn', value: 'Connect on LinkedIn', href: site.linkedinUrl, event: 'linkedin_click' as const },
    site.githubUrl && { icon: GithubIcon, label: 'GitHub', value: 'See my code', href: site.githubUrl, event: 'github_click' as const },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string; event?: 'linkedin_click' | 'github_click' }[];

  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-24 pt-8 sm:pb-32">
      <div className="container">
        <SectionHeading
          id="contact-title"
          eyebrow="Contact"
          title={<>Let&apos;s build <Accent>something</Accent> together.</>}
          description="Messages are sent through this site's own API and stored in its database. I'll get back to you as soon as I can."
        />
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <Reveal className="space-y-3">
            {channels.map(({ icon: Icon, label, value, href, event }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                onClick={() => event && track(event)}
                className="group flex items-center gap-4 rounded-2xl border hairline bg-surface p-4 transition hover:border-accent/30 hover:shadow-soft"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-muted group-hover:text-accent">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-xs text-subtle">{label}</span>
                  <span className="block break-all text-sm font-medium text-ink">{value}</span>
                </span>
              </a>
            ))}
            <div className="flex items-center gap-4 rounded-2xl border hairline bg-surface p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-muted">
                <MapPin className="h-4 w-4" aria-hidden />
              </span>
              <span>
                <span className="block text-xs text-subtle">Studying in</span>
                <span className="block text-sm font-medium text-ink">Mahdia, Tunisia</span>
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="card p-6 sm:p-8">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
