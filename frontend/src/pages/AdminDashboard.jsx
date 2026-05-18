import { useEffect, useState } from 'react';
import { Users, FileText, Calendar, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [suspicious, setSuspicious] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const load = () => Promise.all([
    api.get('/admin/stats'),
    api.get('/admin/reports'),
    api.get('/admin/users'),
    api.get('/admin/suspicious'),
  ]).then(([s, r, u, sus]) => {
    setStats(s.data.stats);
    setReports(r.data.reports);
    setUsers(u.data.users);
    setSuspicious(sus.data.users);
  }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const suspend = async (id, suspendUser = true) => {
    await api.put(`/admin/users/${id}/suspend`, { suspend: suspendUser });
    toast.success(suspendUser ? 'User suspended' : 'User restored');
    load();
  };

  const resolveReport = async (id, status) => {
    await api.put(`/admin/reports/${id}`, { status });
    toast.success('Report updated');
    load();
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reports', label: 'Reports' },
    { id: 'users', label: 'Users' },
    { id: 'risk', label: 'Risk' },
  ];

  const reportStatus = { open: 'warning', investigating: 'brand', resolved: 'success', dismissed: 'outline' };

  return (
    <DashboardLayout title="Administration" description="Platform oversight and moderation">
      <nav className="flex gap-1 p-1 bg-slate-100 dark:bg-zinc-900 rounded-lg w-fit mb-8">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={cn('px-4 py-2 text-sm font-medium rounded-md transition-colors', tab === t.id ? 'bg-white dark:bg-zinc-800 shadow-soft text-slate-900 dark:text-zinc-50' : 'text-slate-500')}>
            {t.label}
          </button>
        ))}
      </nav>
      {tab === 'overview' && (
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {loading ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />) : (
            <>
              <StatCard label="Total users" value={stats?.users} icon={Users} />
              <StatCard label="Skills listed" value={stats?.skills} icon={FileText} />
              <StatCard label="Sessions" value={stats?.sessions} icon={Calendar} />
              <StatCard label="Open reports" value={stats?.openReports} icon={AlertTriangle} />
            </>
          )}
        </section>
      )}
      {tab === 'overview' && !loading && (
        <Card>
          <h3 className="text-sm font-semibold mb-6">Activity overview</h3>
          <div className="h-48 rounded-lg bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center border border-dashed border-slate-200 dark:border-zinc-700">
            <p className="text-sm text-slate-400">Chart visualization placeholder — connect analytics provider</p>
          </div>
        </Card>
      )}
      {tab === 'reports' && (
        <Card className="overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-800/50">
              <tr>
                <th className="text-left p-4 font-medium text-slate-500">Reason</th>
                <th className="text-left p-4 font-medium text-slate-500">Status</th>
                <th className="text-right p-4 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="border-t border-slate-100 dark:border-zinc-800">
                  <td className="p-4"><p className="font-medium">{r.reason}</p><p className="text-slate-500 text-xs mt-0.5">{r.description}</p></td>
                  <td className="p-4"><Badge variant={reportStatus[r.status]} className="capitalize">{r.status}</Badge></td>
                  <td className="p-4 text-right space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => resolveReport(r._id, 'resolved')}>Resolve</Button>
                    <Button size="sm" variant="ghost" onClick={() => resolveReport(r._id, 'dismissed')}>Dismiss</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === 'users' && (
        <Card className="overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-800/50">
              <tr><th className="text-left p-4">Name</th><th className="text-left p-4">Email</th><th className="text-left p-4">Role</th><th className="text-right p-4">Action</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-slate-100 dark:border-zinc-800">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-slate-500">{u.email}</td>
                  <td className="p-4"><Badge variant={u.role === 'admin' ? 'brand' : 'outline'}>{u.role}</Badge></td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant={u.isSuspended ? 'secondary' : 'danger'} onClick={() => suspend(u._id, !u.isSuspended)}>
                      {u.isSuspended ? 'Restore' : 'Suspend'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === 'risk' && (
        <section className="space-y-3">
          {suspicious.map((u) => (
            <Card key={u._id} className="!p-4 flex justify-between items-center">
              <div><p className="font-medium">{u.name}</p><p className="text-xs text-slate-500">Trust {u.trustScore} {u.isSuspended && '· Suspended'}</p></div>
              {!u.isSuspended && <Button size="sm" variant="danger" onClick={() => suspend(u._id)}>Suspend</Button>}
            </Card>
          ))}
        </section>
      )}
    </DashboardLayout>
  );
}
