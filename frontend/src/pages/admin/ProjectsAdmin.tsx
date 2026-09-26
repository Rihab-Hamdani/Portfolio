import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '@/api/endpoints';
import { PageHeader, Table, td, th } from '@/components/admin/AdminUi';
import { ProjectStatusBadge } from '@/components/ProjectCard';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Dialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { useToast } from '@/context/ToastContext';
import type { ProjectDetail } from '@/types';

export default function ProjectsAdmin() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['admin', 'projects'], queryFn: adminApi.projects });
  const [order, setOrder] = useState<ProjectDetail[]>([]);
  const [toDelete, setToDelete] = useState<ProjectDetail | null>(null);

  useEffect(() => {
    if (query.data) setOrder(query.data);
  }, [query.data]);

  const dirty = query.data ? order.map((p) => p.id).join() !== query.data.map((p) => p.id).join() : false;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  };

  const publish = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) => adminApi.publishProject(id, published),
    onSuccess: (p) => {
      toast.success(p.published ? `“${p.title}” is now public.` : `“${p.title}” is now hidden.`);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const reorder = useMutation({
    mutationFn: () => adminApi.reorderProjects(order.map((p) => p.id)),
    onSuccess: () => {
      toast.success('Project order saved.');
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteProject(id),
    onSuccess: () => {
      toast.success('Project deleted.');
      setToDelete(null);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const move = (index: number, delta: number) => {
    const next = [...order];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  };

  return (
    <>
      <PageHeader
        title="Projects"
        description="Create, edit, publish and reorder case studies."
        actions={
          <>
            {dirty && (
              <Button variant="secondary" onClick={() => reorder.mutate()} loading={reorder.isPending} icon={<Save className="h-4 w-4" aria-hidden />}>
                Save order
              </Button>
            )}
            <ButtonLink to="/admin/projects/new" icon={<Plus className="h-4 w-4" aria-hidden />}>
              New project
            </ButtonLink>
          </>
        }
      />

      {query.isLoading && <Skeleton className="h-72" />}
      {query.isError && <ErrorState message={query.error.message} onRetry={() => query.refetch()} />}
      {query.data && order.length === 0 && (
        <EmptyState title="No projects available yet." description="Create your first case study." action={<ButtonLink to="/admin/projects/new">New project</ButtonLink>} />
      )}

      {order.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th className={th}>Order</th>
              <th className={th}>Project</th>
              <th className={th}>Status</th>
              <th className={th}>Visibility</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {order.map((project, i) => (
              <tr key={project.id} className="hover:bg-surface-2/30">
                <td className={td}>
                  <div className="flex items-center gap-1">
                    <span className="w-5 font-mono text-xs text-subtle">{i + 1}</span>
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-subtle hover:text-ink disabled:opacity-30" aria-label={`Move ${project.title} up`}>
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1} className="rounded p-1 text-subtle hover:text-ink disabled:opacity-30" aria-label={`Move ${project.title} down`}>
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                <td className={td}>
                  <Link to={`/admin/projects/${project.id}`} className="font-medium hover:text-accent">
                    {project.title}
                  </Link>
                  <p className="font-mono text-[11px] text-subtle">/{project.slug}</p>
                </td>
                <td className={td}>{project.status ? <ProjectStatusBadge status={project.status} /> : <span className="text-xs text-subtle">—</span>}</td>
                <td className={td}>
                  <div className="flex items-center gap-2">
                    {project.published ? <Badge tone="success" dot>Published</Badge> : <Badge>Hidden</Badge>}
                    {project.featured && <Badge tone="violet">Featured</Badge>}
                  </div>
                </td>
                <td className={`${td} text-right`}>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => publish.mutate({ id: project.id, published: !project.published })}
                      aria-label={project.published ? `Unpublish ${project.title}` : `Publish ${project.title}`}
                      icon={project.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    >
                      <span className="hidden xl:inline">{project.published ? 'Unpublish' : 'Publish'}</span>
                    </Button>
                    <ButtonLink to={`/admin/projects/${project.id}`} variant="ghost" size="sm" aria-label={`Edit ${project.title}`} icon={<Pencil className="h-3.5 w-3.5" />}>
                      <span className="hidden xl:inline">Edit</span>
                    </ButtonLink>
                    <Button variant="ghost" size="sm" onClick={() => setToDelete(project)} aria-label={`Delete ${project.title}`} icon={<Trash2 className="h-3.5 w-3.5 text-danger" />} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete project?"
        description={`“${toDelete?.title ?? ''}” and its analytics link will be removed permanently. This cannot be undone.`}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate(toDelete.id)}
        loading={remove.isPending}
      />
    </>
  );
}
