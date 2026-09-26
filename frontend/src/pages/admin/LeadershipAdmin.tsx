import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { adminApi } from '@/api/endpoints';
import { ListEditor, PageHeader } from '@/components/admin/AdminUi';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog, Dialog } from '@/components/ui/Dialog';
import { InputField, TextAreaField } from '@/components/ui/Field';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import type { LeadershipInput, LeadershipRole } from '@/types';
import { useCrud } from './useCrud';

const EMPTY: LeadershipInput = { organization: '', role: '', periodLabel: '', summary: '', organizational: [], technical: [] };

export default function LeadershipAdmin() {
  const { query, save, remove } = useCrud<LeadershipRole, LeadershipInput>({
    key: 'leadership',
    publicKey: 'leadership',
    list: adminApi.leadership,
    create: adminApi.createLeadership,
    update: adminApi.updateLeadership,
    remove: adminApi.deleteLeadership,
    noun: 'Leadership role',
  });
  const [editing, setEditing] = useState<{ id?: string; values: LeadershipInput } | null>(null);
  const [toDelete, setToDelete] = useState<LeadershipRole | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const open = (item?: LeadershipRole) => {
    setErrors({});
    setEditing(
      item
        ? {
            id: item.id,
            values: {
              organization: item.organization,
              role: item.role,
              periodLabel: item.periodLabel ?? '',
              summary: item.summary ?? '',
              organizational: item.organizational,
              technical: item.technical,
              displayOrder: item.displayOrder,
            },
          }
        : { values: EMPTY },
    );
  };
  const set = <K extends keyof LeadershipInput>(k: K, v: LeadershipInput[K]) => setEditing((e) => e && { ...e, values: { ...e.values, [k]: v } });

  const submit = () => {
    if (!editing) return;
    const errs: Record<string, string> = {};
    if (!editing.values.organization.trim()) errs.organization = 'Organization is required.';
    if (!editing.values.role.trim()) errs.role = 'Role is required.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    save.mutate({ id: editing.id, input: editing.values }, { onSuccess: () => setEditing(null), onError: (e) => setErrors(e.fieldErrors) });
  };

  return (
    <>
      <PageHeader title="Leadership" description="Student branches, associations and community roles." actions={<Button onClick={() => open()} icon={<Plus className="h-4 w-4" aria-hidden />}>Add role</Button>} />
      {query.isLoading && <Skeleton className="h-48" />}
      {query.isError && <ErrorState message={query.error.message} onRetry={() => query.refetch()} />}
      {query.data?.length === 0 && <EmptyState title="No leadership roles yet." />}
      <ul className="grid gap-3 md:grid-cols-2">
        {query.data?.map((item) => (
          <li key={item.id} className="card flex flex-col justify-between gap-4 p-5">
            <div>
              <p className="text-sm text-muted">{item.organization}</p>
              <p className="text-lg font-semibold text-ink">{item.role}</p>
              <p className="mt-1 font-mono text-xs text-subtle">{item.periodLabel || 'No period set'}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => open(item)} icon={<Pencil className="h-3.5 w-3.5" />}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => setToDelete(item)} icon={<Trash2 className="h-3.5 w-3.5 text-danger" />} aria-label={`Delete ${item.role}`} />
            </div>
          </li>
        ))}
      </ul>

      <Dialog
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit leadership role' : 'Add leadership role'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={submit} loading={save.isPending}>Save</Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Organization" required value={editing.values.organization} error={errors.organization} onChange={(e) => set('organization', e.target.value)} />
              <InputField label="Role" required value={editing.values.role} error={errors.role} onChange={(e) => set('role', e.target.value)} />
              <InputField label="Period" value={editing.values.periodLabel ?? ''} onChange={(e) => set('periodLabel', e.target.value)} placeholder="2025–2026" />
            </div>
            <TextAreaField label="Summary" rows={3} value={editing.values.summary ?? ''} onChange={(e) => set('summary', e.target.value)} />
            <ListEditor label="Organizational responsibilities" values={editing.values.organizational} onChange={(v) => set('organizational', v)} />
            <ListEditor label="Technical involvement" values={editing.values.technical} onChange={(v) => set('technical', v)} />
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete leadership role?"
        description={`“${toDelete?.role ?? ''}” at ${toDelete?.organization ?? ''} will be removed.`}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
        loading={remove.isPending}
      />
    </>
  );
}
