import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Card({ children, className, hover = false, padding = true, ...props }) {
  const Comp = hover ? motion.article : 'article';
  const motionProps = hover
    ? { whileHover: { y: -2 }, transition: { duration: 0.2 } }
    : {};

  return (
    <Comp
      className={cn(
        'rounded-xl border border-slate-200/80 bg-white shadow-soft dark:bg-zinc-900 dark:border-zinc-800',
        padding && 'p-6',
        hover && 'cursor-default transition-shadow hover:shadow-card',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <header className={cn('flex items-start justify-between gap-4 mb-4', className)}>
      <div>
        {title && <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-50">{title}</h3>}
        {description && <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">{description}</p>}
      </div>
      {action}
    </header>
  );
}
