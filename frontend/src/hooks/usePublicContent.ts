import { useQuery } from '@tanstack/react-query';
import { publicApi } from '@/api/endpoints';

export const queryKeys = {
  projects: ['projects'] as const,
  project: (slug: string) => ['projects', slug] as const,
  experience: ['experience'] as const,
  leadership: ['leadership'] as const,
  skills: ['skills'] as const,
};

export const useProjects = () => useQuery({ queryKey: queryKeys.projects, queryFn: publicApi.projects });

export const useProject = (slug: string) =>
  useQuery({ queryKey: queryKeys.project(slug), queryFn: () => publicApi.project(slug), enabled: Boolean(slug) });

export const useExperience = () => useQuery({ queryKey: queryKeys.experience, queryFn: publicApi.experience });

export const useLeadership = () => useQuery({ queryKey: queryKeys.leadership, queryFn: publicApi.leadership });

export const useSkills = () => useQuery({ queryKey: queryKeys.skills, queryFn: publicApi.skills });
