import { cn } from '../../lib/utils';

export default function Input({ label, error, hint, className, id, ...props }) {
  const inputId = id || props.name;
  return (
    <label className="block w-full" htmlFor={inputId}>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5 block">{label}</span>}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400',
          'border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600',
          'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-500',
          error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  );
}

export function Textarea({ label, error, className, id, ...props }) {
  const inputId = id || props.name;
  return (
    <label className="block w-full" htmlFor={inputId}>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5 block">{label}</span>}
      <textarea
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm resize-y min-h-[100px]',
          'border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600',
          'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}

export function Select({ label, error, children, className, id, ...props }) {
  const inputId = id || props.name;
  return (
    <label className="block w-full" htmlFor={inputId}>
      {label && <span className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5 block">{label}</span>}
      <select
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2 text-sm',
          'border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600',
          'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}
