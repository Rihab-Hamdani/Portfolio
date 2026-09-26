import type { ProjectStatus } from '@/types';

export const STATUS_META: Record<ProjectStatus, { label: string; tone: 'accent' | 'violet' | 'cyan' | 'warning' | 'neutral' | 'success' }> = {
  CURRENT: { label: 'Current project', tone: 'accent' },
  COMPLETED: { label: 'Completed', tone: 'success' },
  IN_PROGRESS: { label: 'In progress', tone: 'cyan' },
  EXPERIMENTAL: { label: 'Experimental · In progress', tone: 'warning' },
  RESEARCH: { label: 'In progress · Research & validation', tone: 'violet' },
  INTERNSHIP: { label: 'Internship project', tone: 'cyan' },
  DRAFT: { label: 'Draft', tone: 'neutral' },
};

export interface ArchitectureStep {
  label: string;
  detail?: string;
}

/** Architecture steps are stored as "Label|Short description". */
export function parseStep(raw: string): ArchitectureStep {
  const [label, ...rest] = raw.split('|');
  const detail = rest.join('|').trim();
  return { label: label.trim(), detail: detail || undefined };
}

export const SKILL_CATEGORY_LABELS = {
  LANGUAGES: 'Languages',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASES: 'Databases',
  AI: 'AI',
  TOOLS: 'Tools & Infrastructure',
} as const;
