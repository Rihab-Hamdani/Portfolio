export type ProjectStatus =
  | 'CURRENT'
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'EXPERIMENTAL'
  | 'RESEARCH'
  | 'INTERNSHIP'
  | 'DRAFT';

export interface Screenshot {
  src: string;
  caption?: string;
  alt?: string;
}

export interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  summary: string;
  status?: ProjectStatus;
  technologies: string[];
  coverImage?: string;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  displayOrder: number;
}

export interface ProjectDetail extends ProjectSummary {
  context?: string;
  problem?: string;
  solution?: string;
  myRole?: string;
  architectureDescription?: string;
  architectureSteps: string[];
  features: string[];
  contribution: string[];
  challenges: string[];
  learnings: string[];
  researchQuestions: string[];
  screenshots: Screenshot[];
  published: boolean;
  updatedAt?: string;
}

export interface ProjectInput {
  slug: string;
  title: string;
  tagline?: string;
  summary: string;
  context?: string;
  problem?: string;
  solution?: string;
  myRole?: string;
  architectureDescription?: string;
  architectureSteps: string[];
  features: string[];
  contribution: string[];
  challenges: string[];
  learnings: string[];
  researchQuestions: string[];
  screenshots: Screenshot[];
  technologies: string[];
  status?: ProjectStatus | null;
  githubUrl?: string;
  demoUrl?: string;
  coverImage?: string;
  featured: boolean;
  published: boolean;
  displayOrder?: number;
}

export interface Experience {
  id: string;
  organization: string;
  role: string;
  employmentType?: string;
  periodLabel?: string;
  location?: string;
  summary?: string;
  responsibilities: string[];
  technologies: string[];
  projectSlug?: string;
  displayOrder: number;
}

export type ExperienceInput = Omit<Experience, 'id' | 'displayOrder'> & { displayOrder?: number };

export interface LeadershipRole {
  id: string;
  organization: string;
  role: string;
  periodLabel?: string;
  summary?: string;
  organizational: string[];
  technical: string[];
  displayOrder: number;
}

export type LeadershipInput = Omit<LeadershipRole, 'id' | 'displayOrder'> & { displayOrder?: number };

export type SkillCategory = 'LANGUAGES' | 'FRONTEND' | 'BACKEND' | 'DATABASES' | 'AI' | 'TOOLS';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description?: string;
  icon?: string;
  displayOrder: number;
}

export type SkillInput = Omit<Skill, 'id' | 'displayOrder'> & { displayOrder?: number };

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
}

export type MessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'project_view'
  | 'resume_download'
  | 'contact_submit'
  | 'github_click'
  | 'linkedin_click';

export interface AnalyticsSummary {
  days: number;
  totalEvents: number;
  byType: { type: AnalyticsEventType; total: number }[];
  daily: { day: string; pageViews: number; events: number }[];
  topProjects: { slug: string; title: string; total: number }[];
  topPages: { page: string; total: number }[];
}

export interface DashboardOverview {
  projects: number;
  publishedProjects: number;
  experiences: number;
  leadershipRoles: number;
  skills: number;
  messages: number;
  unreadMessages: number;
  eventsLast30Days: number;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

export interface ApiErrorBody {
  timestamp?: string;
  status: number;
  error?: string;
  message?: string;
  path?: string;
  fieldErrors?: Record<string, string>;
}
