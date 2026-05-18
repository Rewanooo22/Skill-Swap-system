import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard').then(({ data }) => setUsers(data.users)).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Leaderboard" description="Top contributors ranked by points">
      <Card className="overflow-hidden !p-0">
        {loading ? <div className="p-6"><StatCardSkeleton /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800">
              <tr>
                <th className="text-left p-4 font-medium text-slate-500 w-16">Rank</th>
                <th className="text-left p-4 font-medium text-slate-500">Member</th>
                <th className="text-left p-4 font-medium text-slate-500">Points</th>
                <th className="text-left p-4 font-medium text-slate-500">Trust</th>
                <th className="text-left p-4 font-medium text-slate-500">Swaps</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} className="border-b border-slate-50 dark:border-zinc-800/50 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                  <td className="p-4">
                    {i < 3 ? <Trophy className={cn('w-4 h-4', i === 0 && 'text-amber-500', i === 1 && 'text-slate-400', i === 2 && 'text-amber-700')} /> : <span className="text-slate-400 font-mono">{i + 1}</span>}
                  </td>
                  <td className="p-4">
                    <Link to={`/profile/${u._id}`} className="flex items-center gap-3 hover:text-brand-600">
                      <Avatar src={u.profilePhoto} name={u.name} size="sm" />
                      <span className="font-medium">{u.name}</span>
                    </Link>
                  </td>
                  <td className="p-4 tabular-nums">{u.points}</td>
                  <td className="p-4"><Badge variant="outline">{u.trustScore}</Badge></td>
                  <td className="p-4 tabular-nums text-slate-500">{u.completedSessions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </DashboardLayout>
  );
}
