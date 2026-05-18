import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import { cn } from '../../lib/utils';

const publicLinks = [
  { to: '/search', label: 'Explore' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export function MarketingNavbar() {
  const { user } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="page-container h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold text-slate-900 dark:text-zinc-50 tracking-tight text-lg">
          Skill Swap
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {publicLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => cn('text-sm font-medium transition-colors', isActive ? 'text-slate-900 dark:text-zinc-50' : 'text-slate-500 hover:text-slate-900 dark:hover:text-zinc-200')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <section className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800" aria-label="Toggle theme">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {user ? (
            <Link to="/dashboard"><Button size="sm">Dashboard</Button></Link>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/register"><Button size="sm">Get started</Button></Link>
            </>
          )}
          <button type="button" className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}><Menu className="w-5 h-5" /></button>
        </section>
      </div>
      {mobileOpen && (
        <nav className="md:hidden border-t border-slate-200 dark:border-zinc-800 p-4 space-y-2 bg-white dark:bg-zinc-950">
          {publicLinks.map((l) => <Link key={l.to} to={l.to} className="block py-2 text-sm" onClick={() => setMobileOpen(false)}>{l.label}</Link>)}
        </nav>
      )}
    </header>
  );
}

export function AppHeader({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    api.get('/notifications').then(({ data }) => setUnread(data.unreadCount)).catch(() => {});
  }, [user]);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
      <button type="button" onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-slate-500"><Menu className="w-5 h-5" /></button>
      <div className="flex-1" />
      <section className="flex items-center gap-2">
        <button type="button" onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <Link to="/notifications" className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-800">
          <Bell className="w-4 h-4" />
          {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-brand-600 rounded-full" />}
        </Link>
        <Dropdown
          trigger={
            <button type="button" className="flex items-center gap-2 p-1.5 pr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800">
              <Avatar src={user?.profilePhoto} name={user?.name} size="sm" />
              <span className="hidden sm:block text-sm font-medium text-slate-700 dark:text-zinc-300 max-w-[120px] truncate">{user?.name}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          }
        >
          <DropdownItem icon={User} onClick={() => navigate(`/profile/${user._id}`)}>Profile</DropdownItem>
          <DropdownItem icon={Settings} onClick={() => navigate('/profile/edit')}>Settings</DropdownItem>
          <DropdownItem icon={LogOut} danger onClick={() => { logout(); navigate('/'); }}>Sign out</DropdownItem>
        </Dropdown>
      </section>
    </header>
  );
}
