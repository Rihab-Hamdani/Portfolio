import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted">{label}</p>
        {icon && <span className="text-subtle">{icon}</span>}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-subtle">{hint}</p>}
    </div>
  );
}

/** Edits a list of strings (features, responsibilities, …) with add / remove / reorder. */
export function ListEditor({ label, values, onChange, placeholder, hint }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string; hint?: string }) {
  const [draft, setDraft] = useState('');
  const id = useId();

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...values, value]);
    setDraft('');
  };
  const move = (index: number, delta: number) => {
    const next = [...values];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[13px] font-medium text-ink">
        {label}
      </label>
      {hint && <p className="text-xs text-subtle">{hint}</p>}
      {values.length > 0 && (
        <ul className="space-y-1.5">
          {values.map((value, i) => (
            <li key={`${value}-${i}`} className="flex items-center gap-2 rounded-lg border hairline bg-surface-2/40 px-3 py-2">
              <input
                aria-label={`${label} item ${i + 1}`}
                value={value}
                onChange={(e) => onChange(values.map((v, j) => (j === i ? e.target.value : v)))}
                className="min-w-0 flex-1 bg-transparent text-sm text-ink focus:outline-none"
              />
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-subtle hover:text-ink disabled:opacity-30" aria-label="Move up">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === values.length - 1} className="rounded p-1 text-subtle hover:text-ink disabled:opacity-30" aria-label="Move down">
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="rounded p-1 text-subtle hover:text-danger" aria-label="Remove item">
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={id}
          value={draft}
          placeholder={placeholder ?? 'Add an item and press Enter'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          className="min-w-0 flex-1 rounded-xl border hairline bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-subtle/70 focus:border-accent/60 focus:outline-none focus:ring-4 focus:ring-accent/15"
        />
        <button type="button" onClick={add} className="grid h-9 w-9 shrink-0 place-items-center self-center rounded-xl border hairline text-muted hover:text-ink" aria-label={`Add to ${label}`}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto rounded-2xl border hairline bg-surface', className)}>
      <table className="w-full min-w-[640px] text-left text-sm">{children}</table>
    </div>
  );
}

export const th = 'border-b hairline px-4 py-3 text-xs font-medium uppercase tracking-wider text-subtle';
export const td = 'border-b hairline px-4 py-3 align-middle text-ink';
