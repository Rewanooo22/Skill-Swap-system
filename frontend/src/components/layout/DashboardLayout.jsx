import { useState } from 'react';
import Sidebar from './Sidebar';
import { AppHeader } from './Navbar';
import PageTransition from '../ui/PageTransition';

export default function DashboardLayout({ children, title, description }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AppHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {(title || description) && (
            <header className="mb-8">
              {title && <h1 className="text-2xl font-semibold text-slate-900 dark:text-zinc-50 tracking-tight">{title}</h1>}
              {description && <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm">{description}</p>}
            </header>
          )}
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
