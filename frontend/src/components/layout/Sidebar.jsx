import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, Users, Calendar, MessageSquare, Trophy,
  Bell, Plus, Shield, X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/search', label: 'Explore', icon: Search },
  { to: '/matches', label: 'Matches', icon: Users },
  { to: '/sessions', label: 'Sessions', icon: Calendar },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { isAdmin } = useAuth();

  const content = (
  <>
    <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-zinc-800">
      <NavLink to="/" className="font-semibold text-slate-900 dark:text-zinc-50 tracking-tight">
        Skill Swap
      </NavLink>
    </div>
    <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onMobileClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
            )
          }
        >
          <Icon className="w-4 h-4 shrink-0" />
          {label}
        </NavLink>
      ))}
      {isAdmin && (
        <NavLink
          to="/admin"
          onClick={onMobileClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400'
            )
          }
        >
          <Shield className="w-4 h-4" />
          Admin
        </NavLink>
      )}
    </nav>
    <section className="p-3 border-t border-slate-200 dark:border-zinc-800">
      <NavLink
        to="/skills/create"
        onClick={onMobileClose}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        New skill card
      </NavLink>
    </section>
  </>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0 fixed inset-y-0 left-0 z-40">
        {content}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-zinc-900/40 z-40"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 flex flex-col bg-white dark:bg-zinc-950 z-50 border-r border-slate-200 dark:border-zinc-800"
            >
              <button type="button" onClick={onMobileClose} className="absolute top-4 right-4 p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
