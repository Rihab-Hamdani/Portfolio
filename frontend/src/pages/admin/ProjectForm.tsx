import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '@/api/endpoints';
import { ListEditor, PageHeader } from '@/components/admin/AdminUi';
import { Button } from '@/components/ui/Button';
import { InputField, SelectField, TextAreaField, Toggle } from '@/components/ui/Field';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { useToast } from '@/context/ToastContext';
import type { ProjectDetail, ProjectInput, ProjectStatus, Screenshot } from '@/types';
import { STATUS_META } from '@/utils/project';

const EMPTY: ProjectInput = {
  slug: '',
  title: '',
  tagline: '',
  summary: '',
  context: '',
  problem: '',
  solution: '',
  myRole: '',
  architectureDescription: '',
  architectureSteps: [],
  features: [],
  contribution: [],
  challenges: [],
  learnings: [],
  researchQuestions: [],
  screenshots: [],
  technologies: [],
  status: null,
  githubUrl: '',
  demoUrl: '',
  coverImage: '',
  featured: false,
  published: false,
};

function toInput(p: ProjectDetail): ProjectInput {
  return {
    slug: p.slug,
    title: p.title,
    tagline: p.tagline ?? '',
    summary: p.summary,
    context: p.context ?? '',
    problem: p.problem ?? '',
    solution: p.solution ?? '',
    myRole: p.myRole ?? '',
    architectureDescription: p.architectureDescription ?? '',
    architectureSteps: p.architectureSteps,
    features: p.features,
    contribution: p.contribution,
    challenges: p.challenges,
    learnings: p.learnings,
    researchQuestions: p.researchQuestions,
    screenshots: p.screenshots,
    technologies: p.technologies,
    status: p.status ?? null,
    githubUrl: p.githubUrl ?? '',
    demoUrl: p.demoUrl ?? '',
    coverImage: p.coverImage ?? '',
    featured: p.featured,
    published: p.published,
    displayOrder: p.displayOrder,
  };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ProjectForm() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [values, setValues] = useState<ProjectInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(!isNew);

  const query = useQuery({ queryKey: ['admin', 'project', id], queryFn: () => adminApi.project(id!), enabled: !isNew });
  useEffect(() => {
    if (query.data) setValues(toInput(query.data));
  }, [query.data]);

  const save = useMutation({
    mutationFn: (input: ProjectInput) => (isNew ? adminApi.createProject(input) : adminApi.updateProject(id!, input)),
    onSuccess: (project) => {
      toast.success(isNew ? 'Project created.' : 'Project saved.');
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (isNew) navigate(`/admin/projects/${project.id}`, { replace: true });
    },
    onError: (error) => {
      setErrors(error.fieldErrors);
      toast.error(error.message);
    },
  });

  const set = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const clientErrors: Record<string, string> = {};
    if (!values.title.trim()) clientErrors.title = 'Title is required.';
    if (!values.summary.trim()) clientErrors.summary = 'Summary is required.';
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(values.slug)) clientErrors.slug = 'Use lowercase letters, numbers and hyphens only.';
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;
    save.mutate({ ...values, screenshots: values.screenshots.filter((s) => s.src.trim()) });
  };

  const updateShot = (index: number, patch: Partial<Screenshot>) =>
    set(
      'screenshots',
      values.screenshots.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );

  if (!isNew && query.isLoading) return <Skeleton className="h-[600px]" />;
  if (!isNew && query.isError) return <ErrorState message={query.error.message} onRetry={() => query.refetch()} />;

  return (
    <form onSubmit={onSubmit} noValidate>
      <Link to="/admin/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Projects
      </Link>
      <PageHeader
        title={isNew ? 'New project' : values.title || 'Edit project'}
        description="Only write what is true. Empty sections are hidden on the public page."
        actions={
          <>
            {!isNew && values.published && (
              <a href={`/projects/${values.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-xl px-4 text-sm text-muted hover:text-ink">
                View public page
              </a>
            )}
            <Button type="submit" loading={save.isPending}>
              {isNew ? 'Create project' : 'Save changes'}
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <fieldset className="card space-y-4 p-5">
            <legend className="sr-only">Basics</legend>
            <InputField
              label="Title"
              required
              value={values.title}
              error={errors.title}
              onChange={(e) => {
                set('title', e.target.value);
                if (!slugTouched) set('slug', slugify(e.target.value));
              }}
            />
            <InputField
              label="Slug"
              required
              value={values.slug}
              error={errors.slug}
              hint="Used in the URL: /projects/your-slug"
              onChange={(e) => {
                setSlugTouched(true);
                set('slug', e.target.value);
              }}
            />
            <InputField label="Tagline" value={values.tagline} error={errors.tagline} onChange={(e) => set('tagline', e.target.value)} maxLength={300} />
            <TextAreaField label="Summary" required rows={4} value={values.summary} error={errors.summary} onChange={(e) => set('summary', e.target.value)} />
            <TextAreaField label="Context" rows={3} value={values.context} onChange={(e) => set('context', e.target.value)} />
            <TextAreaField label="My role" rows={2} value={values.myRole} onChange={(e) => set('myRole', e.target.value)} />
          </fieldset>

          <fieldset className="card space-y-4 p-5">
            <legend className="sr-only">Case study</legend>
            <TextAreaField label="Problem" rows={3} value={values.problem} onChange={(e) => set('problem', e.target.value)} />
            <TextAreaField label="Solution" rows={3} value={values.solution} onChange={(e) => set('solution', e.target.value)} />
            <TextAreaField label="Architecture description" rows={3} value={values.architectureDescription} onChange={(e) => set('architectureDescription', e.target.value)} />
            <ListEditor label="Architecture steps" hint='Format: "Label|Short description", in order.' values={values.architectureSteps} onChange={(v) => set('architectureSteps', v)} />
            <ListEditor label="Key features" values={values.features} onChange={(v) => set('features', v)} />
            <ListEditor label="My contribution" hint="Use for team / internship projects to separate your work from the wider platform." values={values.contribution} onChange={(v) => set('contribution', v)} />
            <ListEditor label="Challenges / engineering considerations" values={values.challenges} onChange={(v) => set('challenges', v)} />
            <ListEditor label="What I learned" hint="Write these in your own words." values={values.learnings} onChange={(v) => set('learnings', v)} />
            <ListEditor label="Research questions" values={values.researchQuestions} onChange={(v) => set('researchQuestions', v)} />
          </fieldset>

          <fieldset className="card space-y-4 p-5">
            <legend className="mb-2 text-[13px] font-medium text-ink">Screenshots</legend>
            <p className="text-xs text-subtle">Put image files in frontend/public/projects/&lt;slug&gt;/ and reference them as /projects/&lt;slug&gt;/file.webp.</p>
            {values.screenshots.map((shot, i) => (
              <div key={i} className="grid gap-3 rounded-xl border hairline p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                <InputField label="Image path / URL" value={shot.src} onChange={(e) => updateShot(i, { src: e.target.value })} />
                <InputField label="Caption" value={shot.caption ?? ''} onChange={(e) => updateShot(i, { caption: e.target.value })} />
                <InputField label="Alt text" value={shot.alt ?? ''} onChange={(e) => updateShot(i, { alt: e.target.value })} />
                <button
                  type="button"
                  onClick={() => set('screenshots', values.screenshots.filter((_, j) => j !== i))}
                  className="self-end rounded-lg p-2.5 text-subtle hover:text-danger"
                  aria-label={`Remove screenshot ${i + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={() => set('screenshots', [...values.screenshots, { src: '', caption: '', alt: '' }])} icon={<Plus className="h-3.5 w-3.5" aria-hidden />}>
              Add screenshot
            </Button>
          </fieldset>
        </div>

        <div className="space-y-6">
          <fieldset className="card space-y-4 p-5">
            <legend className="sr-only">Publishing</legend>
            <Toggle label="Published" description="Visible on the public site." checked={values.published} onChange={(v) => set('published', v)} />
            <Toggle label="Featured" description="Shown in the main project grid." checked={values.featured} onChange={(v) => set('featured', v)} />
            <SelectField label="Status" value={values.status ?? ''} onChange={(e) => set('status', (e.target.value || null) as ProjectStatus | null)}>
              <option value="">No status label</option>
              {(Object.keys(STATUS_META) as ProjectStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s].label}
                </option>
              ))}
            </SelectField>
          </fieldset>
          <fieldset className="card space-y-4 p-5">
            <legend className="sr-only">Links and technologies</legend>
            <ListEditor label="Technologies" values={values.technologies} onChange={(v) => set('technologies', v)} placeholder="e.g. Spring Boot" />
            <InputField label="GitHub URL" type="url" value={values.githubUrl} error={errors.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/…" />
            <InputField label="Demo URL" type="url" value={values.demoUrl} error={errors.demoUrl} onChange={(e) => set('demoUrl', e.target.value)} placeholder="https://…" />
            <InputField label="Cover image" value={values.coverImage} onChange={(e) => set('coverImage', e.target.value)} placeholder="/projects/slug/cover.webp" />
          </fieldset>
        </div>
      </div>
    </form>
  );
}
