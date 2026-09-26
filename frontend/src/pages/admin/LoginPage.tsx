import { Lock } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toApiError } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/Field';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || '/admin';
  if (status === 'authenticated') return <Navigate to={from} replace />;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    if (!email.trim() || !password) {
      setFieldErrors({ ...(email.trim() ? {} : { email: 'Email is required.' }), ...(password ? {} : { password: 'Password is required.' }) });
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      const apiError = toApiError(err);
      setFieldErrors(apiError.fieldErrors);
      setError(apiError.status === 401 ? 'Invalid email or password.' : apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-dvh place-items-center px-4">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="gradient-border mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-surface text-accent">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Manage portfolio content, messages and analytics.</p>
        </div>
        <form onSubmit={onSubmit} noValidate className="card space-y-4 p-6">
          <InputField label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} error={fieldErrors.email} required />
          <InputField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={fieldErrors.password} required />
          {error && (
            <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-muted hover:text-ink">
            ← Back to portfolio
          </Link>
        </p>
      </div>
    </div>
  );
}
