import { cn } from '../lib/utils';
import { Users, Calendar, MessageSquare, Star, Bell, XCircle } from 'lucide-react';

const config = {
  match: { icon: Users, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/30' },
  session: { icon: Calendar, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30' },
  message: { icon: MessageSquare, color: 'text-slate-600 bg-slate-100 dark:bg-zinc-800' },
  review: { icon: Star, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30' },
  system: { icon: Bell, color: 'text-slate-600 bg-slate-100' },
  cancellation: { icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-950/30' },
};

export default function NotificationItem({ notification, onRead }) {
  const { icon: Icon, color } = config[notification.type] || config.system;

  return (
    <button
      type="button"
      onClick={() => onRead?.(notification._id)}
      className={cn(
        'w-full flex gap-3 p-4 text-left border-b border-slate-100 dark:border-zinc-800 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50',
        !notification.read && 'bg-slate-50/80 dark:bg-zinc-900/50'
      )}
    >
      <span className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', color)}>
        <Icon className="w-4 h-4" />
      </span>
      <section className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-zinc-50">{notification.title}</p>
        <p className="text-sm text-slate-500 truncate">{notification.body}</p>
        <time className="text-xs text-slate-400 mt-1 block">{new Date(notification.createdAt).toLocaleString()}</time>
      </section>
      {!notification.read && <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-2" />}
    </button>
  );
}
