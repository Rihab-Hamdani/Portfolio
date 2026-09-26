import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/client';
import { Projects } from '@/sections/Projects';
import type { ProjectSummary } from '@/types';
import { renderWithProviders } from './utils';

// Plain function (not vi.fn) so rejected promises are only observed by React Query.
let projectsImpl: () => Promise<ProjectSummary[]> = () => Promise.resolve([]);
vi.mock('@/api/endpoints', () => ({
  publicApi: {
    projects: () => projectsImpl(),
    track: () => Promise.resolve(),
  },
}));

describe('Projects section (data from GET /api/projects)', () => {
  it('renders projects returned by the API, featured first and others as experiments', async () => {
    projectsImpl = () =>
      Promise.resolve([
        { id: '1', slug: 'medical-cabinet-stock-management', title: 'Medical Cabinet Stock Management PWA', summary: 's', technologies: ['Angular 18'], featured: true, displayOrder: 1, status: 'CURRENT' },
        { id: '2', slug: 'netai-monitor', title: 'NetAI-Monitor', summary: 's', technologies: [], featured: false, displayOrder: 5, status: 'EXPERIMENTAL' },
      ]);
    renderWithProviders(<Projects />);

    expect(await screen.findByRole('link', { name: 'Medical Cabinet Stock Management PWA' })).toBeInTheDocument();
    expect(screen.getByText('More experiments')).toBeInTheDocument();
    expect(screen.getByText('Experimental · In progress')).toBeInTheDocument();
  });

  it('shows an empty state instead of fake content', async () => {
    projectsImpl = () => Promise.resolve([]);
    renderWithProviders(<Projects />);
    expect(await screen.findByText('No projects available yet.')).toBeInTheDocument();
  });

  it('shows a friendly error with retry when the API fails', async () => {
    projectsImpl = () => Promise.reject(new ApiError(0, 'Could not reach the server. Check your connection and try again.'));
    renderWithProviders(<Projects />);
    expect(await screen.findByText(/Could not reach the server/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });
});
