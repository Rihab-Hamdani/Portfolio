import { http } from './client';
import type {
  AnalyticsEventType,
  AnalyticsSummary,
  AuthUser,
  ContactInput,
  ContactMessage,
  DashboardOverview,
  Experience,
  ExperienceInput,
  LeadershipInput,
  LeadershipRole,
  LoginResponse,
  MessageStatus,
  Page,
  ProjectDetail,
  ProjectInput,
  ProjectSummary,
  Skill,
  SkillInput,
} from '@/types';

// ---------- Public ----------

export const publicApi = {
  projects: () => http.get<ProjectSummary[]>('/projects').then((r) => r.data),
  project: (slug: string) => http.get<ProjectDetail>(`/projects/${encodeURIComponent(slug)}`).then((r) => r.data),
  experience: () => http.get<Experience[]>('/experience').then((r) => r.data),
  leadership: () => http.get<LeadershipRole[]>('/leadership').then((r) => r.data),
  skills: () => http.get<Skill[]>('/skills').then((r) => r.data),
  contact: (input: ContactInput) => http.post<{ message: string }>('/contact', input).then((r) => r.data),
  track: (event: {
    eventType: AnalyticsEventType;
    page?: string;
    projectSlug?: string;
    metadata?: Record<string, string | number | boolean>;
  }) => http.post('/analytics/events', event).then(() => undefined),
};

// ---------- Auth ----------

export const authApi = {
  login: (email: string, password: string) =>
    http.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),
  me: () => http.get<AuthUser>('/auth/me').then((r) => r.data),
};

// ---------- Admin ----------

export const adminApi = {
  overview: () => http.get<DashboardOverview>('/admin/overview').then((r) => r.data),

  projects: () => http.get<ProjectDetail[]>('/admin/projects').then((r) => r.data),
  project: (id: string) => http.get<ProjectDetail>(`/admin/projects/${id}`).then((r) => r.data),
  createProject: (input: ProjectInput) => http.post<ProjectDetail>('/admin/projects', input).then((r) => r.data),
  updateProject: (id: string, input: ProjectInput) =>
    http.put<ProjectDetail>(`/admin/projects/${id}`, input).then((r) => r.data),
  publishProject: (id: string, published: boolean) =>
    http.patch<ProjectDetail>(`/admin/projects/${id}/publish`, { published }).then((r) => r.data),
  reorderProjects: (ids: string[]) => http.put<ProjectDetail[]>('/admin/projects/order', { ids }).then((r) => r.data),
  deleteProject: (id: string) => http.delete(`/admin/projects/${id}`).then(() => undefined),

  experience: () => http.get<Experience[]>('/admin/experience').then((r) => r.data),
  createExperience: (input: ExperienceInput) => http.post<Experience>('/admin/experience', input).then((r) => r.data),
  updateExperience: (id: string, input: ExperienceInput) =>
    http.put<Experience>(`/admin/experience/${id}`, input).then((r) => r.data),
  deleteExperience: (id: string) => http.delete(`/admin/experience/${id}`).then(() => undefined),

  leadership: () => http.get<LeadershipRole[]>('/admin/leadership').then((r) => r.data),
  createLeadership: (input: LeadershipInput) =>
    http.post<LeadershipRole>('/admin/leadership', input).then((r) => r.data),
  updateLeadership: (id: string, input: LeadershipInput) =>
    http.put<LeadershipRole>(`/admin/leadership/${id}`, input).then((r) => r.data),
  deleteLeadership: (id: string) => http.delete(`/admin/leadership/${id}`).then(() => undefined),

  skills: () => http.get<Skill[]>('/admin/skills').then((r) => r.data),
  createSkill: (input: SkillInput) => http.post<Skill>('/admin/skills', input).then((r) => r.data),
  updateSkill: (id: string, input: SkillInput) => http.put<Skill>(`/admin/skills/${id}`, input).then((r) => r.data),
  deleteSkill: (id: string) => http.delete(`/admin/skills/${id}`).then(() => undefined),

  messages: (params: { status?: MessageStatus; page?: number; size?: number }) =>
    http.get<Page<ContactMessage>>('/admin/messages', { params }).then((r) => r.data),
  updateMessage: (id: string, status: MessageStatus) =>
    http.patch<ContactMessage>(`/admin/messages/${id}`, { status }).then((r) => r.data),
  deleteMessage: (id: string) => http.delete(`/admin/messages/${id}`).then(() => undefined),

  analytics: (days: number) =>
    http.get<AnalyticsSummary>('/admin/analytics/summary', { params: { days } }).then((r) => r.data),
};
