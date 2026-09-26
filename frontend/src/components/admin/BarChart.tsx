import { useState } from 'react';
import { formatNumber } from '@/utils/format';

/**
 * Single-series daily bar chart (one hue, no legend needed — the heading names the series).
 * Days without events are shown as zero so gaps are honest. Each bar has a hover/focus tooltip.
 */
export function DailyBarChart({ data, label }: { data: { day: string; value: number }[]; label: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));
  const height = 180;
  const gap = 2;
  const barWidth = Math.max(4, (720 - gap * (data.length - 1)) / data.length);
  const width = data.length * barWidth + gap * (data.length - 1);
  const ticks = [0, Math.ceil(max / 2), max];

  return (
    <figure>
      <div className="relative">
        <svg viewBox={`-32 -8 ${width + 40} ${height + 30}`} className="w-full" role="img" aria-label={`${label} per day`}>
          {ticks.map((t) => {
            const y = height - (t / max) * height;
            return (
              <g key={t}>
                <line x1={0} x2={width} y1={y} y2={y} stroke="rgb(var(--line) / 0.12)" strokeWidth="1" />
                <text x={-8} y={y + 4} textAnchor="end" className="fill-subtle text-[10px] tabular-nums">
                  {t}
                </text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const h = (d.value / max) * height;
            const x = i * (barWidth + gap);
            return (
              <g key={d.day}>
                {/* Larger invisible hit target */}
                <rect
                  x={x}
                  y={0}
                  width={barWidth + gap}
                  height={height}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${d.day}: ${d.value}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                />
                {d.value > 0 && (
                  <path
                    d={`M${x},${height} v${-(h - Math.min(4, h))} q0,${-Math.min(4, h)} ${Math.min(4, barWidth / 2)},${-Math.min(4, h)} h${barWidth - 2 * Math.min(4, barWidth / 2)} q${Math.min(4, barWidth / 2)},0 ${Math.min(4, barWidth / 2)},${Math.min(4, h)} v${h - Math.min(4, h)} z`}
                    fill={hover === i ? 'rgb(var(--violet))' : 'rgb(var(--accent))'}
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}
          <line x1={0} x2={width} y1={height} y2={height} stroke="rgb(var(--line) / 0.3)" />
          {[0, Math.floor(data.length / 2), data.length - 1].map((i) =>
            data[i] ? (
              <text key={i} x={i * (barWidth + gap) + barWidth / 2} y={height + 18} textAnchor="middle" className="fill-subtle text-[10px]">
                {data[i].day.slice(5)}
              </text>
            ) : null,
          )}
        </svg>
        {hover !== null && data[hover] && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg border hairline bg-surface px-2.5 py-1.5 text-xs shadow-soft"
            style={{ left: `${((hover * (barWidth + gap) + barWidth / 2 + 32) / (width + 40)) * 100}%` }}
          >
            <p className="text-subtle">{data[hover].day}</p>
            <p className="font-medium text-ink tabular-nums">
              {formatNumber(data[hover].value)} {label.toLowerCase()}
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}

/** Horizontal magnitude bars with text labels (values always visible as text). */
export function HorizontalBars({ items }: { items: { label: string; value: number; href?: string }[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-ink">{item.label}</span>
            <span className="tabular-nums text-muted">{formatNumber(item.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-surface-2">
            <div className="h-2 rounded-full bg-accent" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
