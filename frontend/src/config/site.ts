/**
 * Public site configuration, read from Vite environment variables at build time.
 * Empty values mean "not provided yet": the related link or button is hidden rather than invented.
 */
const env = import.meta.env;

const clean = (value: string | undefined) => (value ?? '').trim();

export const site = {
  name: 'Rihab Hamdani',
  title: 'Rihab Hamdani | Software Engineering Student',
  description:
    'Software Engineering student building full-stack and AI-powered applications — frontend, backend, APIs, databases and AI.',
  url: clean(env.VITE_SITE_URL).replace(/\/$/, ''),
  apiUrl: clean(env.VITE_API_URL) || '/api',
  githubUrl: clean(env.VITE_GITHUB_URL),
  linkedinUrl: clean(env.VITE_LINKEDIN_URL),
  email: clean(env.VITE_EMAIL),
  resumeUrl: clean(env.VITE_RESUME_URL) || '/Rihab-Hamdani-CV.pdf',
  profilePhoto: clean(env.VITE_PROFILE_PHOTO) || '/images/profile.jpg',
} as const;

export type SiteConfig = typeof site;
