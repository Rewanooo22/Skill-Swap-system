import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="page-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <section className="col-span-2 md:col-span-1">
            <Link to="/" className="font-semibold text-slate-900 dark:text-zinc-50 tracking-tight">
              Skill Swap
            </Link>
            <p className="text-sm text-slate-500 mt-3 max-w-xs">
              A professional network for exchanging skills through structured sessions and trusted reputation.
            </p>
          </section>
          {[
            { title: 'Platform', links: [['Explore', '/search'], ['Matches', '/matches'], ['Sessions', '/sessions']] },
            { title: 'Company', links: [['About', '/'], ['Leaderboard', '/leaderboard'], ['Contact', '/']] },
            { title: 'Legal', links: [['Privacy', '/'], ['Terms', '/']] },
          ].map((col) => (
            <section key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 group">
                      {label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-10 pt-6 border-t border-slate-100 dark:border-zinc-800">
          © {new Date().getFullYear()} Skill Swap. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
