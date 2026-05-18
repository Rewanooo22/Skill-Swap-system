import { cn } from '../../lib/utils';

export default function Skeleton({ className }) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-slate-200 dark:bg-zinc-800', className)}>
      <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/10" />
    </div>
  );
}

export function SkillCardSkeleton() {
  return (
    <article className="rounded-xl border border-slate-200 dark:border-zinc-800 p-6 space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-full mt-4" />
    </article>
  );
}

export function StatCardSkeleton() {
  return (
    <article className="rounded-xl border border-slate-200 dark:border-zinc-800 p-6">
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-8 w-16" />
    </article>
  );
}
