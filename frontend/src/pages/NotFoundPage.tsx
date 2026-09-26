import { ArrowLeft } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export default function NotFoundPage({ title = 'Page not found', message = "The page you're looking for doesn't exist or has moved." }: { title?: string; message?: string }) {
  useDocumentMeta({ title });
  return (
    <section className="container flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-md text-muted">{message}</p>
      <ButtonLink to="/" variant="secondary" className="mt-8" icon={<ArrowLeft className="h-4 w-4" aria-hidden />}>
        Back to home
      </ButtonLink>
    </section>
  );
}
