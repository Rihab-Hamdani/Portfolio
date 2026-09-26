export function formatDate(iso: string | undefined, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', options).format(date);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export const EVENT_LABELS: Record<string, string> = {
  page_view: 'Page views',
  project_view: 'Project views',
  resume_download: 'Resume downloads',
  contact_submit: 'Contact submissions',
  github_click: 'GitHub clicks',
  linkedin_click: 'LinkedIn clicks',
};
