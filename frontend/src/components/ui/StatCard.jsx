import Card from './Card';
import { cn } from '../../lib/utils';

export default function StatCard({ label, value, change, icon: Icon, className }) {
  return (
    <Card hover className={cn('!p-5', className)} padding={false}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-zinc-50 mt-1 tabular-nums">{value}</p>
          {change != null && (
            <p className={cn('text-xs mt-1', change >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <span className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800">
            <Icon className="w-5 h-5 text-slate-600 dark:text-zinc-400" />
          </span>
        )}
      </div>
    </Card>
  );
}
