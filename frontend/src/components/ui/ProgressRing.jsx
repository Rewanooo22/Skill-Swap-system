import { cn } from '../../lib/utils';

export default function ProgressRing({ value, max = 100, size = 80, label, sublabel }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <figure className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-zinc-800" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-brand-600 transition-all duration-500"
        />
      </svg>
      <figcaption className="text-center -mt-14 pt-0">
        <p className="text-lg font-semibold text-slate-900 dark:text-zinc-50">{label ?? value}</p>
        {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
      </figcaption>
    </figure>
  );
}
