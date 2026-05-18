import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Users, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import Card, { CardHeader } from '../components/ui/Card';
import SessionCard from '../components/SessionCard';
import UserCard from '../components/UserCard';
import SkillCard from '../components/SkillCard';
import ProgressRing from '../components/ui/ProgressRing';
import { StatCardSkeleton, SkillCardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/sessions?status=accepted'),
      api.get('/matches'),
      api.get('/messages/conversations'),
      api.get('/skills?limit=3'),
    ]).then(([s, m, c, sk]) => {
      setSessions(s.data.sessions?.slice(0, 3) || []);
      setMatches(m.data.matches?.slice(0, 2) || []);
      setConversations(c.data.conversations?.slice(0, 4) || []);
      setSkills(sk.data.skills || []);
    }).finally(() => setLoading(false));
  }, []);

  const upcoming = sessions.filter((s) => new Date(s.proposedTime) > new Date());

  return (
    <DashboardLayout title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'}`} description="Your skill exchange overview">
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />) : (
          <>
            <StatCard label="Trust score" value={user?.trustScore ?? 0} icon={TrendingUp} />
            <StatCard label="Points" value={user?.points ?? 0} icon={TrendingUp} />
            <StatCard label="Sessions" value={user?.completedSessions ?? 0} icon={Calendar} />
            <StatCard label="Rating" value={user?.averageRating || '—'} icon={Users} />
          </>
        )}
      </section>

      <section className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader title="Upcoming sessions" action={<Link to="/sessions" className="text-sm text-brand-600 flex items-center gap-1">View all <ArrowRight className="w-4 h-4" /></Link>} />
          {loading ? <p className="text-sm text-slate-500">Loading...</p> : upcoming.length ? (
            <section className="space-y-4">
              {upcoming.map((s) => <SessionCard key={s._id} session={s} currentUserId={user._id} />)}
            </section>
          ) : (
            <p className="text-sm text-slate-500 py-8 text-center">No upcoming sessions. <Link to="/sessions" className="text-brand-600">Schedule one</Link></p>
          )}
        </Card>
        <Card>
          <CardHeader title="Trust & reputation" />
          <div className="flex justify-center py-4">
            <ProgressRing value={user?.trustScore ?? 0} max={100} label={`${user?.trustScore ?? 0}`} sublabel="Trust score" />
          </div>
          <p className="text-center text-sm text-slate-500">Average rating: {user?.averageRating || '—'} / 5</p>
          <Link to={`/profile/${user._id}`} className="block mt-4"><Button variant="secondary" className="w-full" size="sm">View profile</Button></Link>
        </Card>
      </section>

      <section className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader title="Recommended matches" action={<Link to="/matches" className="text-sm text-brand-600">See all</Link>} />
          {loading ? null : matches.length ? (
            <section className="space-y-4">
              {matches.map((m, i) => <UserCard key={m.user._id} user={m.user} score={m.score} reasons={m.reasons} index={i} onProposeSession={() => {}} />)}
            </section>
          ) : <p className="text-sm text-slate-500">Complete your profile to get matches.</p>}
        </Card>
        <Card>
          <CardHeader title="Recent messages" action={<Link to="/messages" className="text-sm text-brand-600">Open inbox</Link>} />
          <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
            {conversations.map((c) => (
              <li key={c.user._id}>
                <Link to={`/messages/${c.user._id}`} className="flex items-center gap-3 py-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 -mx-2 px-2 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <section className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{c.lastMessage?.content}</p>
                  </section>
                  {c.unread > 0 && <span className="text-xs bg-brand-600 text-white px-1.5 py-0.5 rounded-full">{c.unread}</span>}
                </Link>
              </li>
            ))}
            {!conversations.length && <p className="text-sm text-slate-500 py-4">No conversations yet</p>}
          </ul>
        </Card>
      </section>

      <section>
        <CardHeader title="Trending skills" action={<Link to="/search" className="text-sm text-brand-600">Explore</Link>} />
        <div className="grid md:grid-cols-3 gap-6">
          {loading ? Array.from({ length: 3 }).map((_, i) => <SkillCardSkeleton key={i} />) : skills.map((s, i) => <SkillCard key={s._id} skill={s} index={i} />)}
        </div>
      </section>
    </DashboardLayout>
  );
}
