import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Archive, ChevronDown, Mail, MailOpen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { adminApi } from '@/api/endpoints';
import { PageHeader } from '@/components/admin/AdminUi';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Dialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useToast } from '@/context/ToastContext';
import type { ContactMessage, MessageStatus } from '@/types';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format';

const FILTERS: Array<{ value?: MessageStatus; label: string }> = [
  { label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'READ', label: 'Read' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export default function MessagesAdmin() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<MessageStatus | undefined>();
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);

  const query = useQuery({ queryKey: ['admin', 'messages', status, page], queryFn: () => adminApi.messages({ status, page, size: 20 }) });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin'] });
  const update = useMutation({
    mutationFn: ({ id, next }: { id: string; next: MessageStatus }) => adminApi.updateMessage(id, next),
    onSuccess: invalidate,
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteMessage(id),
    onSuccess: () => {
      toast.success('Message deleted.');
      setToDelete(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const toggle = (m: ContactMessage) => {
    const opening = expanded !== m.id;
    setExpanded(opening ? m.id : null);
    if (opening && m.status === 'NEW') update.mutate({ id: m.id, next: 'READ' });
  };

  return (
    <>
      <PageHeader title="Messages" description="Sent through the public contact form." />
      <div className="mb-5 flex flex-wrap gap-1.5" role="group" aria-label="Filter messages">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            aria-pressed={status === f.value}
            onClick={() => {
              setStatus(f.value);
              setPage(0);
            }}
            className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition', status === f.value ? 'bg-ink text-bg dark:bg-white dark:text-slate-900' : 'text-muted hover:bg-surface-2 hover:text-ink')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {query.isLoading && <Skeleton className="h-64" />}
      {query.isError && <ErrorState message={query.error.message} onRetry={() => query.refetch()} />}
      {query.data && query.data.items.length === 0 && <EmptyState title="No messages yet." description={status ? 'No messages with this status.' : 'Messages from the contact form will appear here.'} />}

      {query.data && query.data.items.length > 0 && (
        <ul className="space-y-2">
          {query.data.items.map((m) => {
            const isOpen = expanded === m.id;
            return (
              <li key={m.id} className={cn('card overflow-hidden', m.status === 'NEW' && 'border-accent/30')}>
                <button type="button" onClick={() => toggle(m)} aria-expanded={isOpen} className="flex w-full items-start gap-4 p-4 text-left">
                  <span className={cn('mt-0.5', m.status === 'NEW' ? 'text-accent' : 'text-subtle')}>{m.status === 'NEW' ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={cn('truncate text-sm', m.status === 'NEW' ? 'font-semibold text-ink' : 'text-ink')}>{m.subject}</span>
                      {m.status === 'ARCHIVED' && <Badge>Archived</Badge>}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {m.name} · {m.email}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-subtle">{formatDate(m.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <ChevronDown className={cn('h-4 w-4 shrink-0 text-subtle transition', isOpen && 'rotate-180')} aria-hidden />
                </button>
                {isOpen && (
                  <div className="border-t hairline px-4 pb-4 pt-3 sm:pl-12">
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-ink">{m.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-ink px-3 text-xs font-medium text-bg dark:bg-white dark:text-slate-900">
                        <Mail className="h-3.5 w-3.5" aria-hidden /> Reply by email
                      </a>
                      {m.status !== 'ARCHIVED' ? (
                        <Button variant="secondary" size="sm" onClick={() => update.mutate({ id: m.id, next: 'ARCHIVED' })} icon={<Archive className="h-3.5 w-3.5" />}>
                          Archive
                        </Button>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => update.mutate({ id: m.id, next: 'READ' })}>
                          Unarchive
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setToDelete(m)} icon={<Trash2 className="h-3.5 w-3.5 text-danger" />}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {query.data && query.data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm text-muted">
          <span>
            Page {query.data.page + 1} of {query.data.totalPages}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled={page + 1 >= query.data.totalPages} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete message?"
        description={`The message from ${toDelete?.name ?? ''} will be permanently deleted.`}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id)}
        loading={remove.isPending}
      />
    </>
  );
}
