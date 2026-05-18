import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Modal({ open, onClose, title, description, children, size = 'md', className }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <AnimatePresence>
      {open && (
        <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close"
          />
          <motion.article
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative w-full rounded-xl border bg-white shadow-elevated dark:bg-zinc-900 dark:border-zinc-800',
              sizes[size],
              className
            )}
          >
            <header className="flex items-start justify-between gap-4 p-6 border-b border-slate-100 dark:border-zinc-800">
              <div>
                {title && <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-50">{title}</h2>}
                {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
              </div>
              <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </header>
            <div className="p-6">{children}</div>
          </motion.article>
        </section>
      )}
    </AnimatePresence>
  );
}
