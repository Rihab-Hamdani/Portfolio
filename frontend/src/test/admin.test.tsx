import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import AnalyticsAdmin from '@/pages/admin/AnalyticsAdmin';
import { RequireAuth } from '@/pages/admin/RequireAuth';
import { renderWithProviders } from './utils';

const analytics = vi.fn();
vi.mock('@/api/endpoints', () => ({
  adminApi: { analytics: (days: number) => analytics(days) },
  authApi: { me: vi.fn(), login: vi.fn() },
  publicApi: { track: () => Promise.resolve() },
}));

describe('Admin authorization (client side)', () => {
  beforeEach(() => sessionStorage.clear());

  it('redirects anonymous visitors to the login page', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/admin']}>
          <ToastProvider>
            <AuthProvider>
              <Routes>
                <Route path="/admin/login" element={<p>Login screen</p>} />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <p>Secret dashboard</p>
                    </RequireAuth>
                  }
                />
              </Routes>
            </AuthProvider>
          </ToastProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Login screen')).toBeInTheDocument();
    expect(screen.queryByText('Secret dashboard')).not.toBeInTheDocument();
  });

  it('treats an expired stored token as signed out', () => {
    sessionStorage.setItem('portfolio.admin.token', 'old');
    sessionStorage.setItem('portfolio.admin.expiresAt', new Date(Date.now() - 1000).toISOString());
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/admin']}>
          <ToastProvider>
            <AuthProvider>
              <Routes>
                <Route path="/admin/login" element={<p>Login screen</p>} />
                <Route path="/admin" element={<RequireAuth><p>Secret dashboard</p></RequireAuth>} />
              </Routes>
            </AuthProvider>
          </ToastProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });
});

describe('Analytics dashboard', () => {
  it('shows "No analytics data yet." instead of fake numbers', async () => {
    analytics.mockResolvedValue({ days: 30, totalEvents: 0, byType: [], daily: [], topProjects: [], topPages: [] });
    renderWithProviders(<AnalyticsAdmin />);
    expect(await screen.findByText('No analytics data yet.')).toBeInTheDocument();
  });

  it('renders real counts when events exist', async () => {
    analytics.mockResolvedValue({
      days: 30,
      totalEvents: 3,
      byType: [
        { type: 'page_view', total: 2 },
        { type: 'project_view', total: 1 },
      ],
      daily: [{ day: new Date().toISOString().slice(0, 10), pageViews: 2, events: 3 }],
      topProjects: [{ slug: 'hezly', title: 'Hezly', total: 1 }],
      topPages: [{ page: '/', total: 2 }],
    });
    renderWithProviders(<AnalyticsAdmin />);
    expect(await screen.findByText('Page views per day')).toBeInTheDocument();
    expect(screen.getByText('Hezly')).toBeInTheDocument();
  });
});
