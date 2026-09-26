import { Play } from 'lucide-react';
import { useState } from 'react';
import { http } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { highlight } from './highlight';

type Endpoint = {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  auth: 'Public' | 'Admin (JWT)';
  /** Live requests hit this site's real API. Examples are clearly labelled as such. */
  live?: () => Promise<{ status: number; data: unknown }>;
  exampleRequest?: string;
  exampleResponse?: string;
};

const ENDPOINTS: Endpoint[] = [
  {
    id: 'projects',
    method: 'GET',
    path: '/api/projects',
    description: 'Published projects, ordered. Drafts are never returned.',
    auth: 'Public',
    live: () => http.get('/projects').then((r) => ({ status: r.status, data: r.data })),
  },
  {
    id: 'project',
    method: 'GET',
    path: '/api/projects/studymate-ai',
    description: 'One case study by slug. Unknown or unpublished slugs return a structured 404.',
    auth: 'Public',
    live: () => http.get('/projects/studymate-ai').then((r) => ({ status: r.status, data: r.data })),
  },
  {
    id: 'skills',
    method: 'GET',
    path: '/api/skills',
    description: 'Skills grouped by category — no percentages.',
    auth: 'Public',
    live: () => http.get('/skills').then((r) => ({ status: r.status, data: r.data })),
  },
  {
    id: 'admin',
    method: 'GET',
    path: '/api/admin/messages',
    description: 'Admin-only. Without a valid JWT the API answers 401 — try it.',
    auth: 'Admin (JWT)',
    live: () =>
      http
        .get('/admin/messages', { headers: { Authorization: '' } })
        .then((r) => ({ status: r.status, data: r.data }))
        .catch((e: { status?: number; message?: string }) => ({ status: e.status ?? 0, data: { status: e.status, message: e.message } })),
  },
  {
    id: 'contact',
    method: 'POST',
    path: '/api/contact',
    description: 'Validated, sanitised, rate-limited and stored in PostgreSQL.',
    auth: 'Public',
    exampleRequest: `{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Internship",
  "message": "Hello Rihab, ..."
}`,
    exampleResponse: `// 201 Created
{ "message": "Thanks for your message. I'll get back to you soon." }

// 400 Bad Request
{
  "status": 400,
  "message": "Some fields are invalid.",
  "fieldErrors": { "email": "Please enter a valid email address." }
}

// 429 Too Many Requests  (Retry-After header set)`,
  },
  {
    id: 'login',
    method: 'POST',
    path: '/api/auth/login',
    description: 'Returns a signed JWT for the admin dashboard. Brute force is rate-limited.',
    auth: 'Public',
    exampleRequest: `{ "email": "admin@example.com", "password": "••••••••" }`,
    exampleResponse: `// 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresAt": "2026-01-01T12:00:00Z",
  "user": { "email": "admin@example.com", "role": "ADMIN" }
}

// 401 Unauthorized
{ "status": 401, "message": "Invalid email or password." }`,
  },
];

function truncate(data: unknown) {
  const json = JSON.stringify(data, null, 2) ?? '';
  const lines = json.split('\n');
  return lines.length > 40 ? `${lines.slice(0, 40).join('\n')}\n  … (${lines.length - 40} more lines)` : json;
}

export function ApiExplorer() {
  const [selected, setSelected] = useState(ENDPOINTS[0].id);
  const [result, setResult] = useState<{ status: number; ms: number; body: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const endpoint = ENDPOINTS.find((e) => e.id === selected)!;

  const run = async () => {
    if (!endpoint.live) return;
    setLoading(true);
    const start = performance.now();
    try {
      const res = await endpoint.live();
      setResult({ status: res.status, ms: Math.round(performance.now() - start), body: truncate(res.data) });
    } catch (e) {
      const err = e as { status?: number; message?: string };
      setResult({ status: err.status ?? 0, ms: Math.round(performance.now() - start), body: truncate({ status: err.status, message: err.message }) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <ul className="space-y-1.5" aria-label="Endpoints">
        {ENDPOINTS.map((e) => (
          <li key={e.id}>
            <button
              type="button"
              aria-pressed={selected === e.id}
              onClick={() => {
                setSelected(e.id);
                setResult(null);
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition',
                selected === e.id ? 'border-accent/30 bg-surface shadow-soft' : 'hairline hover:bg-surface/60',
              )}
            >
              <span className={cn('w-11 shrink-0 font-mono text-[11px] font-semibold', e.method === 'GET' ? 'text-success' : 'text-accent')}>{e.method}</span>
              <span className="truncate font-mono text-[12.5px] text-ink">{e.path}</span>
              {!e.live && <span className="ml-auto shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] text-subtle">example</span>}
            </button>
          </li>
        ))}
      </ul>

      <div className="min-w-0 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-muted">{endpoint.description}</p>
            <p className="mt-1 font-mono text-[11px] text-subtle">Auth: {endpoint.auth}</p>
          </div>
          {endpoint.live && (
            <Button size="sm" onClick={run} loading={loading} icon={<Play className="h-3.5 w-3.5" aria-hidden />}>
              Send live request
            </Button>
          )}
        </div>

        {endpoint.exampleRequest && (
          <div>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-subtle">Example request body</p>
            <pre className="code-block">{highlight(endpoint.exampleRequest)}</pre>
          </div>
        )}

        {endpoint.live ? (
          <div aria-live="polite">
            <div className="mb-1.5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-subtle">
              <span>Response</span>
              {result && (
                <>
                  <span className={cn('rounded px-1.5 py-0.5 normal-case', result.status >= 200 && result.status < 300 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning')}>
                    {result.status || 'network error'}
                  </span>
                  <span className="normal-case">{result.ms} ms (measured in your browser)</span>
                </>
              )}
            </div>
            <pre className="code-block max-h-80 min-h-[160px]">{result ? highlight(result.body) : <span className="text-slate-500">// Press “Send live request” to call this site's API.</span>}</pre>
          </div>
        ) : (
          <div>
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-subtle">Documented responses</p>
            <pre className="code-block max-h-80">{highlight(endpoint.exampleResponse ?? '')}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
