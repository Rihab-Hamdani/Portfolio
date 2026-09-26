import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { adminApi } from '@/api/endpoints';
import { PageHeader, Table, td, th } from '@/components/admin/AdminUi';
import { TECH_ICON_NAMES, TechIcon } from '@/components/icons/TechIcon';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog, Dialog } from '@/components/ui/Dialog';
import { InputField, SelectField } from '@/components/ui/Field';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import type { Skill, SkillCategory, SkillInput } from '@/types';
import { SKILL_CATEGORY_LABELS } from '@/utils/project';
import { useCrud } from './useCrud';

const EMPTY: SkillInput = { name: '', category: 'LANGUAGES', description: '', icon: 'code', displayOrder: 0 };

export default function SkillsAdmin() {
  const { query, save, remove } = useCrud<Skill, SkillInput>({
    key: 'skills',
    publicKey: 'skills',
    list: adminApi.skills,
    create: adminApi.createSkill,
    update: adminApi.updateSkill,
    remove: adminApi.deleteSkill,
    noun: 'Skill',
  });
  const [editing, setEditing] = useState<{ id?: string; values: SkillInput } | null>(null);
  const [toDelete, setToDelete] = useState<Skill | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const sorted = useMemo(() => query.data ?? [], [query.data]);

  const set = <K extends keyof SkillInput>(k: K, v: SkillInput[K]) => setEditing((e) => e && { ...e, values: { ...e.values, [k]: v } });

  const submit = () => {
    if (!editing) return;
    if (!editing.values.name.trim()) {
      setErrors({ name: 'Name is required.' });
      return;
    }
    save.mutate({ id: editing.id, input: editing.values }, { onSuccess: () => setEditing(null), onError: (e) => setErrors(e.fieldErrors) });
  };

  return (
    <>
      <PageHeader
        title="Skills"
        description="Only technologies you have actually used. No percentages."
        actions={
          <Button onClick={() => { setErrors({}); setEditing({ values: EMPTY }); }} icon={<Plus className="h-4 w-4" aria-hidden />}>
            Add skill
          </Button>
        }
      />
      {query.isLoading && <Skeleton className="h-72" />}
      {query.isError && <ErrorState message={query.error.message} onRetry={() => query.refetch()} />}
      {query.data?.length === 0 && <EmptyState title="No skills yet." />}
      {sorted.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th className={th}>Skill</th>
              <th className={th}>Category</th>
              <th className={th}>Description</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className="hover:bg-surface-2/30">
                <td className={td}>
                  <span className="flex items-center gap-2.5 font-medium">
                    <TechIcon name={s.icon} className="h-4 w-4 text-subtle" /> {s.name}
                  </span>
                </td>
                <td className={`${td} text-muted`}>{SKILL_CATEGORY_LABELS[s.category]}</td>
                <td className={`${td} max-w-xs truncate text-muted`}>{s.description}</td>
                <td className={`${td} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" aria-label={`Edit ${s.name}`} onClick={() => { setErrors({}); setEditing({ id: s.id, values: { name: s.name, category: s.category, description: s.description ?? '', icon: s.icon ?? '', displayOrder: s.displayOrder } }); }} icon={<Pencil className="h-3.5 w-3.5" />} />
                    <Button variant="ghost" size="sm" aria-label={`Delete ${s.name}`} onClick={() => setToDelete(s)} icon={<Trash2 className="h-3.5 w-3.5 text-danger" />} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Dialog
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit skill' : 'Add skill'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={submit} loading={save.isPending}>Save</Button>
          </>
        }
      >
        {editing && (
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Name" required value={editing.values.name} error={errors.name} onChange={(e) => set('name', e.target.value)} />
            <SelectField label="Category" value={editing.values.category} onChange={(e) => set('category', e.target.value as SkillCategory)}>
              {(Object.keys(SKILL_CATEGORY_LABELS) as SkillCategory[]).map((c) => (
                <option key={c} value={c}>{SKILL_CATEGORY_LABELS[c]}</option>
              ))}
            </SelectField>
            <InputField className="sm:col-span-2" label="Description" value={editing.values.description ?? ''} onChange={(e) => set('description', e.target.value)} maxLength={300} />
            <SelectField label="Icon" value={editing.values.icon ?? ''} onChange={(e) => set('icon', e.target.value)}>
              {TECH_ICON_NAMES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </SelectField>
            <InputField label="Display order" type="number" value={String(editing.values.displayOrder ?? 0)} onChange={(e) => set('displayOrder', Number(e.target.value) || 0)} />
          </div>
        )}
      </Dialog>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete skill?"
        description={`“${toDelete?.name ?? ''}” will be removed from the public skills section.`}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) })}
        loading={remove.isPending}
      />
    </>
  );
}
