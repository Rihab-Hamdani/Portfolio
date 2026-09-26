import { ArrowRight, Download } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Button, buttonClass } from '@/components/ui/Button';
import { useResume } from '@/hooks/useResume';

export function FinalCta() {
  const { download, checking } = useResume();
  return (
    <section aria-labelledby="cta-title" className="py-16 sm:py-24">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-[2rem] border hairline bg-[#0B1020] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(79_70_229/0.35),transparent_70%),radial-gradient(40%_60%_at_100%_100%,rgb(139_92_246/0.25),transparent_70%)]" />
          <div aria-hidden className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgb(148_163_184/0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(148_163_184/0.08)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
          <div className="relative mx-auto max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-indigo-300">Internships · PFE</p>
            <h2 id="cta-title" className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Looking for a software engineering intern who likes building things that <span className="font-serif font-normal italic text-indigo-200">actually work</span>?
            </h2>
            <p className="mt-5 text-lg text-slate-300">Let&apos;s talk.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#contact" className={buttonClass('primary', 'lg', '!bg-white !text-slate-900')}>
                Contact Me <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="#projects" className={buttonClass('secondary', 'lg', '!border-white/15 !bg-white/5 !text-white hover:!border-white/30')}>
                View Projects
              </a>
              <Button
                variant="ghost"
                size="lg"
                onClick={download}
                loading={checking}
                className="!text-slate-300 hover:!bg-white/10 hover:!text-white"
                icon={<Download className="h-4 w-4" aria-hidden />}
              >
                Download Resume
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
