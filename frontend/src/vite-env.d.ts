/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_GITHUB_URL?: string;
  readonly VITE_LINKEDIN_URL?: string;
  readonly VITE_EMAIL?: string;
  readonly VITE_RESUME_URL?: string;
  readonly VITE_PROFILE_PHOTO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
