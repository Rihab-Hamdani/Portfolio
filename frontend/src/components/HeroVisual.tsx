import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useCallback, type PointerEvent } from 'react';
import { ProfilePortrait } from './ProfilePortrait';

/** Nodes of a small, real architecture: the stack this portfolio and my projects use. */
const NODES = [
  { id: 'ui', label: 'Angular · React', sub: 'UI', x: 8, y: 14, side: 'left' },
  { id: 'api', label: 'Spring Boot', sub: 'REST API', x: 92, y: 28, side: 'right' },
  { id: 'ai', label: 'LLM API', sub: 'AI', x: 8, y: 56, side: 'left' },
  { id: 'db', label: 'PostgreSQL', sub: 'Data', x: 92, y: 66, side: 'right' },
] as const;

const EDGES: [string, string][] = [
  ['ui', 'api'],
  ['api', 'db'],
  ['api', 'ai'],
];

function point(id: string) {
  const node = NODES.find((n) => n.id === id)!;
  return { x: node.x, y: node.y };
}

export function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const nearX = useTransform(sx, (v) => v * 10);
  const nearY = useTransform(sy, (v) => v * 10);
  const farX = useTransform(sx, (v) => v * -6);
  const farY = useTransform(sy, (v) => v * -6);

  const onMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (reduceMotion || event.pointerType !== 'mouse') return;
      const rect = event.currentTarget.getBoundingClientRect();
      mx.set((event.clientX - rect.left) / rect.width - 0.5);
      my.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my, reduceMotion],
  );

  return (
    <div
      className="relative mx-auto aspect-[1/1.02] w-full max-w-[520px] select-none"
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* Soft glow + grid */}
      <div aria-hidden className="absolute inset-[8%] rounded-full bg-gradient-to-br from-accent/25 via-violet/20 to-cyan/15 blur-3xl" />
      <div aria-hidden className="bg-grid absolute inset-0 rounded-[2.5rem] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_72%)]" />

      {/* Architecture graph */}
      <motion.svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        style={{ x: farX, y: farY }}
      >
        <defs>
          <linearGradient id="edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="rgb(var(--accent))" stopOpacity="0.55" />
            <stop offset="1" stopColor="rgb(var(--cyan))" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {EDGES.map(([from, to]) => {
          const a = point(from);
          const b = point(to);
          const d = `M ${a.x} ${a.y} Q 50 50 ${b.x} ${b.y}`;
          return (
            <g key={`${from}-${to}`}>
              <path d={d} fill="none" stroke="url(#edge)" strokeWidth="0.35" strokeDasharray="1.2 1.4" vectorEffect="non-scaling-stroke" />
              {!reduceMotion && (
                <circle r="0.9" fill="rgb(var(--cyan))">
                  <animateMotion dur={`${3.6 + from.length * 0.4}s`} repeatCount="indefinite" path={d} />
                </circle>
              )}
            </g>
          );
        })}
      </motion.svg>

      {/* Portrait */}
      <motion.div className="absolute inset-x-[17%] inset-y-[9%]" style={{ x: nearX, y: nearY }}>
        <ProfilePortrait className="h-full w-full" />
      </motion.div>

      {/* Nodes */}
      {NODES.map((node, i) => (
        <div
          key={node.id}
          aria-hidden
          className="absolute -translate-y-1/2"
          style={node.side === 'left' ? { left: 0, top: `${node.y}%` } : { right: 0, top: `${node.y}%` }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
          >
          <div className={reduceMotion ? '' : 'animate-float'} style={{ animationDelay: `${i * 0.9}s` }}>
            <div className="glass flex items-center gap-2 rounded-xl px-2.5 py-1.5 shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-accent to-cyan" />
              <span className="whitespace-nowrap text-[11px] font-medium text-ink">{node.label}</span>
              <span className="hidden whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-subtle sm:inline">{node.sub}</span>
            </div>
          </div>
          </motion.div>
        </div>
      ))}

      {/* Terminal card */}
      <div aria-hidden className="absolute bottom-[1%] left-1/2 w-[82%] max-w-[330px] -translate-x-1/2 sm:left-[46%]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        style={{ x: nearX, y: nearY }}
      >
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B1020]/95 shadow-lift backdrop-blur">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-2 font-mono text-[10px] text-slate-400">portfolio-api</span>
          </div>
          <pre className="px-3 py-2.5 font-mono text-[10.5px] leading-relaxed text-slate-300">
            <span className="text-slate-500">$</span> curl /api/projects{'\n'}
            <span className="text-emerald-400">HTTP/1.1 200</span> <span className="text-slate-500">application/json</span>{'\n'}
            [{'{'} <span className="text-sky-300">"slug"</span>: <span className="text-amber-200">"studymate-ai"</span>, … {'}'}]
            <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 animate-blink bg-slate-300" />
          </pre>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
