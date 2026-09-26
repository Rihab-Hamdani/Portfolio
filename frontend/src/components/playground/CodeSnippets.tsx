import { useState } from 'react';
import { cn } from '@/utils/cn';
import { highlight } from './highlight';

/** Excerpts from this repository — not invented code. */
const SNIPPETS = [
  {
    id: 'jwt',
    label: 'JWT filter',
    file: 'backend/.../security/JwtAuthenticationFilter.java',
    code: `// The account is re-loaded on every request, so a disabled
// admin loses access immediately — not when the token expires.
jwtService.validate(token)
        .flatMap(userRepository::findById)
        .filter(user -> user.isEnabled())
        .ifPresent(user -> {
            var principal = new AuthenticatedUser(user.getId(), user.getEmail(), user.getRole().name());
            var authentication = new UsernamePasswordAuthenticationToken(
                    principal, null, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        });`,
  },
  {
    id: 'contact',
    label: 'Contact service',
    file: 'backend/.../service/ContactService.java',
    code: `@Transactional
public boolean submit(ContactRequest request, String clientIp) {
    rateLimiter.check("contact", clientIp, rateLimitProperties.contactPerHour(), Duration.ofHours(1));

    // Honeypot: humans never see this field. Pretend success so bots learn nothing.
    if (StringUtils.hasText(request.website())) {
        return false;
    }

    String message = InputSanitizer.multiLine(request.message());
    ...
    repository.save(entity);
    notificationService.notifyNewMessage(saved);   // optional, async
    return true;
}`,
  },
  {
    id: 'sql',
    label: 'Flyway migration',
    file: 'backend/src/main/resources/db/migration/V1__init_schema.sql',
    code: `CREATE TABLE project_technologies (
    project_id    UUID    NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
    technology_id UUID    NOT NULL REFERENCES technologies (id) ON DELETE RESTRICT,
    position      INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (project_id, technology_id)
);

CREATE INDEX idx_analytics_type_occurred ON analytics_events (event_type, occurred_at);`,
  },
  {
    id: 'react',
    label: 'React Query hook',
    file: 'frontend/src/hooks/usePublicContent.ts',
    code: `export const useProjects = () =>
  useQuery({ queryKey: queryKeys.projects, queryFn: publicApi.projects });

// Every API error is normalised once, so components only
// deal with { status, message, fieldErrors }.
http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
);`,
  },
];

export function CodeSnippets() {
  const [active, setActive] = useState(SNIPPETS[0].id);
  const snippet = SNIPPETS.find((s) => s.id === active)!;
  return (
    <div>
      <p className="mb-4 text-sm text-muted">Shortened excerpts from this repository&apos;s own source code.</p>
      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Code snippets">
        {SNIPPETS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={active === s.id}
            onClick={() => setActive(s.id)}
            className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition', active === s.id ? 'bg-ink text-bg dark:bg-white dark:text-slate-900' : 'text-muted hover:bg-surface-2 hover:text-ink')}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border hairline">
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#0B1020] px-4 py-2 font-mono text-[11px] text-slate-400">
          <span className="truncate">{snippet.file}</span>
        </div>
        <pre className="code-block rounded-none border-0">{highlight(snippet.code)}</pre>
      </div>
    </div>
  );
}
