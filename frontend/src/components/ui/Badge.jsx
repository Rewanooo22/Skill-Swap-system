import { cn } from '../../lib/utils';

const variants = {
  default: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-400',
  success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  danger: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  outline: 'border border-slate-200 text-slate-600 dark:border-zinc-700 dark:text-zinc-400',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
