import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function EmptyState({ icon: Icon, title, message, action, className }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}
    >
      {Icon && (
        <span className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-slate-400" />
        </span>
      )}
      <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-50">{title}</h3>
      {message && <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 max-w-sm">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.section>
  );
}
