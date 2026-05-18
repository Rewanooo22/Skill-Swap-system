import { cn } from '../../lib/utils';

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' };

export default function Avatar({ src, name, size = 'md', className }) {
  const initial = name?.[0]?.toUpperCase() || '?';
  return src ? (
    <img src={src} alt={name || ''} className={cn('rounded-full object-cover', sizes[size], className)} />
  ) : (
    <span className={cn('rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center font-medium text-slate-600 dark:text-zinc-300', sizes[size], className)}>
      {initial}
    </span>
  );
}
