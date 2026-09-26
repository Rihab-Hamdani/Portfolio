import { CircleAlert, Inbox, RotateCcw } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed hairline px-6 py-12 text-center', className)}>
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-surface-2 text-subtle">{icon ?? <Inbox className="h-5 w-5" />}</div>
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry, className }: { message: string; onRetry?: () => void; className?: string }) {
  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center rounded-2xl border hairline bg-danger/5 px-6 py-10 text-center', className)}>
      <CircleAlert className="mb-2 h-5 w-5 text-danger" aria-hidden />
      <p className="text-sm text-ink">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry} icon={<RotateCcw className="h-3.5 w-3.5" />}>
          Try again
        </Button>
      )}
    </div>
  );
}
