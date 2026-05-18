import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import UserCard from '../components/UserCard';
import EmptyState from '../components/ui/EmptyState';
import { SkillCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { Users } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/matches').then(({ data }) => setMatches(data.matches)).finally(() => setLoading(false));
  }, []);

  const handleConnect = async (userId) => {
    await api.post(`/matches/${userId}/connect`);
    toast.success('Connection request sent');
  };

  return (
    <DashboardLayout title="Matchmaking" description="Ranked by skill compatibility, availability, and trust">
      {loading ? (
        <div className="space-y-4 max-w-2xl">{Array.from({ length: 3 }).map((_, i) => <SkillCardSkeleton key={i} />)}</div>
      ) : matches.length ? (
        <section className="space-y-4 max-w-2xl">
          {matches.map((m, i) => (
            <UserCard
              key={m.user._id}
              user={m.user}
              score={m.score}
              reasons={m.reasons}
              index={i}
              onConnect={handleConnect}
              onProposeSession={(uid) => navigate('/sessions', { state: { guest: uid } })}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Users}
          title="No matches yet"
          message="Add offered and requested skills to your profile to discover partners"
          action={<Button onClick={() => navigate('/profile/edit')}>Update profile</Button>}
        />
      )}
    </DashboardLayout>
  );
}
