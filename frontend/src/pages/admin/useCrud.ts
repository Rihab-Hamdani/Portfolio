import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/context/ToastContext';

/** Shared list + create/update/delete wiring for simple admin collections. */
export function useCrud<T extends { id: string }, I>(options: {
  key: string;
  publicKey: string;
  list: () => Promise<T[]>;
  create: (input: I) => Promise<T>;
  update: (id: string, input: I) => Promise<T>;
  remove: (id: string) => Promise<void>;
  noun: string;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['admin', options.key], queryFn: options.list });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
    queryClient.invalidateQueries({ queryKey: [options.publicKey] });
  };

  const save = useMutation({
    mutationFn: ({ id, input }: { id?: string; input: I }) => (id ? options.update(id, input) : options.create(input)),
    onSuccess: (_, { id }) => {
      toast.success(id ? `${options.noun} updated.` : `${options.noun} created.`);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => options.remove(id),
    onSuccess: () => {
      toast.success(`${options.noun} deleted.`);
      invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  return { query, save, remove };
}
