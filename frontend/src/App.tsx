import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { PublicLayout } from '@/layouts/PublicLayout';
import HomePage from '@/pages/HomePage';
import { RequireAuth } from '@/pages/admin/RequireAuth';

// Code splitting: case studies, 404 and the whole admin area load on demand.
const ProjectPage = lazy(() => import('@/pages/ProjectPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const LoginPage = lazy(() => import('@/pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const ProjectsAdmin = lazy(() => import('@/pages/admin/ProjectsAdmin'));
const ProjectForm = lazy(() => import('@/pages/admin/ProjectForm'));
const ExperienceAdmin = lazy(() => import('@/pages/admin/ExperienceAdmin'));
const LeadershipAdmin = lazy(() => import('@/pages/admin/LeadershipAdmin'));
const SkillsAdmin = lazy(() => import('@/pages/admin/SkillsAdmin'));
const MessagesAdmin = lazy(() => import('@/pages/admin/MessagesAdmin'));
const AnalyticsAdmin = lazy(() => import('@/pages/admin/AnalyticsAdmin'));

function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status">
      <Loader2 className="h-5 w-5 animate-spin text-subtle" aria-label="Loading" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="admin/login" element={<LoginPage />} />
        <Route
          path="admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id" element={<ProjectForm />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="leadership" element={<LeadershipAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="analytics" element={<AnalyticsAdmin />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
