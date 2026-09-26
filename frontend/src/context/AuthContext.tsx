import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TOKEN_KEY, onUnauthorized } from '@/api/client';
import { authApi } from '@/api/endpoints';
import type { AuthUser } from '@/types';

/**
 * JWT is kept in sessionStorage (cleared when the browser closes) rather than localStorage.
 * The backend also re-checks the account on every request, so a disabled admin loses access at once.
 */
interface AuthState {
  user: AuthUser | null;
  status: 'checking' | 'authenticated' | 'anonymous';
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const EXPIRES_KEY = 'portfolio.admin.expiresAt';

function storage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function hasValidToken() {
  const store = storage();
  const token = store?.getItem(TOKEN_KEY);
  const expiresAt = store?.getItem(EXPIRES_KEY);
  return Boolean(token && expiresAt && new Date(expiresAt).getTime() > Date.now());
}

function clearToken() {
  storage()?.removeItem(TOKEN_KEY);
  storage()?.removeItem(EXPIRES_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    user: null,
    status: hasValidToken() ? 'checking' : 'anonymous',
  }));

  const logout = useCallback(() => {
    clearToken();
    setState({ user: null, status: 'anonymous' });
  }, []);

  useEffect(() => {
    const unsubscribe = onUnauthorized(logout);
    return () => {
      unsubscribe();
    };
  }, [logout]);

  useEffect(() => {
    if (state.status !== 'checking') return;
    let cancelled = false;
    authApi
      .me()
      .then((user) => !cancelled && setState({ user, status: 'authenticated' }))
      .catch(() => !cancelled && logout());
    return () => {
      cancelled = true;
    };
  }, [state.status, logout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    storage()?.setItem(TOKEN_KEY, response.token);
    storage()?.setItem(EXPIRES_KEY, response.expiresAt);
    setState({ user: response.user, status: 'authenticated' });
  }, []);

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
