import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { adminApi } from '@/api/endpoints';
import { ListEditor, PageHeader } from '@/components/admin/AdminUi';
import { TechChip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog, Dialog } from '@/components/ui/Dialog';
import { InputField, TextAreaField } from '@/components/ui/Field';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import type { Experience, ExperienceInput } from '@/types';
import { useCrud } from './useCrud';

const EMPTY: ExperienceInput = { organization: '', role: '', employmentType: '', periodLabel: '', location: '', summary: '', responsibilities: [], technologies: [], projectSlug: '' };

export default function ExperienceAdmin() {
  const { query, save, remove } = useCrud<Experience, ExperienceInput>({
    key: 'experience',
    publicKey: 'experience',
    list: adminApi.experience,
    create: adminApi.createExperience,
    update: adminApi.updateExperience,
    remove: adminApi.deleteExperience,
    noun: 'Experience',
  });
  const [editing, setEditing] = useState<{ id?: string; values: ExperienceInput } | null>(null);
  const [toDelete, setToDelete] = useState<Experience | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const open = (item?: Experience) => {
    setErrors({});
    setEditing(item ? { id: item.id, values: { ...EMPTY, ...stripNulls(item) } } : { values: EMPTY });
  };
  const set = <K extends keyof ExperienceInput>(k: K, v: ExperienceInput[K]) => setEditing((e) => e && { ...e, values: { ...e.values, [k]: v } });

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
      <PageHeader title="Experience" description="Internships and professional experience." actions={<Button onClick={() => open()} icon={<Plus className="h-4 w-4" aria-hidden />}>Add experience</Button>} />
      {query.isLoading && <Skeleton className="h-48" />}
      {query.isError && <ErrorState message={query.error.message} onRetry={() => query.refetch()} />}
      {query.data?.length === 0 && <EmptyState title="No experience yet." />}
      <ul className="space-y-3">
        {query.data?.map((item) => (
          <li key={item.id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm text-accent">{item.organization}</p>
              <p className="font-semibold text-ink">{item.role}</p>
              <p className="mt-1 text-xs text-subtle">{item.periodLabel || 'No period set'}{item.employmentType ? ` · ${item.employmentType}` : ''}</p>
              {item.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.technologies.map((t) => (
                    <TechChip key={t}>{t}</TechChip>
                  ))}
                </div>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <Button variant="ghost" size="sm" onClick={() => open(item)} icon={<Pencil className="h-3.5 w-3.5" />} aria-label={`Edit ${item.role}`}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => setToDelete(item)} icon={<Trash2 className="h-3.5 w-3.5 text-danger" />} aria-label={`Delete ${item.role}`} />
            </div>
          </li>
        ))}
      </ul>

      <Dialog
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit experience' : 'Add experience'}
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
              <InputField label="Type" value={editing.values.employmentType ?? ''} onChange={(e) => set('employmentType', e.target.value)} placeholder="Internship" />
              <InputField label="Period" value={editing.values.periodLabel ?? ''} onChange={(e) => set('periodLabel', e.target.value)} placeholder="e.g. Jul 2025 – Aug 2025" />
              <InputField label="Location" value={editing.values.location ?? ''} onChange={(e) => set('location', e.target.value)} />
              <InputField label="Related project slug" value={editing.values.projectSlug ?? ''} onChange={(e) => set('projectSlug', e.target.value)} placeholder="hezly" />
            </div>
            <TextAreaField label="Summary" rows={3} value={editing.values.summary ?? ''} onChange={(e) => set('summary', e.target.value)} />
            <ListEditor label="Responsibilities" values={editing.values.responsibilities} onChange={(v) => set('responsibilities', v)} />
            <ListEditor label="Technologies" values={editing.values.technologies} onChange={(v) => set('technologies', v)} />
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete experience?"
        description={`“${toDelete?.role ?? ''}” at ${toDelete?.organization ?? ''} will be removed.`}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
        loading={remove.isPending}
      />
    </>
  );
}

function stripNulls<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined)) as Partial<T>;
}
