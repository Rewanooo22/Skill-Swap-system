import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MessageSquare, Pencil, Star } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card, { CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import ProgressRing from '../components/ui/ProgressRing';
import ReviewCard from '../components/ReviewCard';
import BadgeDisplay from '../components/BadgeDisplay';
import Modal from '../components/ui/Modal';
import ProfileForm from '../components/ProfileForm';
import { StatCardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, refreshUser } = useAuth();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const isOwn = currentUser?._id === id;

  const load = () => {
    Promise.all([api.get(`/users/${id}`), api.get(`/users/${id}/reviews`)]).then(([u, r]) => {
      setUser(u.data.user);
      setReviews(r.data.reviews);
      if (isOwn) {
        const uu = u.data.user;
        setForm({
          name: uu.name, bio: uu.bio, location: uu.location, languages: uu.languages,
          offeredSkillsText: uu.offeredSkills?.map((s) => `${s.name}:${s.level}`).join(', '),
          requestedSkillsText: uu.requestedSkills?.map((s) => `${s.name}:${s.level}`).join(', '),
        });
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const parseSkills = (text) =>
    (text || '').split(',').map((s) => s.trim()).filter(Boolean).map((p) => {
      const [name, level = 'intermediate'] = p.split(':').map((x) => x.trim());
      return { name, level };
    });

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/profile', {
        name: form.name, bio: form.bio, location: form.location,
        languages: Array.isArray(form.languages) ? form.languages : String(form.languages || '').split(',').map((l) => l.trim()),
        offeredSkills: parseSkills(form.offeredSkillsText),
        requestedSkills: parseSkills(form.requestedSkillsText),
      });
      await refreshUser();
      toast.success('Profile updated');
      setEditOpen(false);
      load();
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout title="Profile"><StatCardSkeleton /></DashboardLayout>;
  if (!user) return <DashboardLayout title="Profile"><p>User not found</p></DashboardLayout>;

  return (
    <DashboardLayout title={user.name} description={user.location || 'Member profile'}>
      <section className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <header className="flex flex-col sm:flex-row gap-6">
            <Avatar src={user.profilePhoto} name={user.name} size="xl" />
            <section className="flex-1">
              <div className="flex flex-wrap gap-2 items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-slate-500 text-sm mt-1">{user.bio || 'No bio provided'}</p>
                </div>
                {isOwn ? (
                  <Button variant="secondary" size="sm" icon={Pencil} onClick={() => setEditOpen(true)}>Edit</Button>
                ) : currentUser && (
                  <Link to={`/messages/${id}`}><Button size="sm" icon={MessageSquare}>Message</Button></Link>
                )}
              </div>
              <section className="flex flex-wrap gap-3 mt-4">
                <Badge variant="outline" className="gap-1"><Star className="w-3 h-3" />{user.averageRating || '—'} ({user.reviewCount})</Badge>
                <Badge variant="brand">Trust {user.trustScore}</Badge>
                <Badge variant="outline">{user.points} pts</Badge>
              </section>
            </section>
          </header>
          <section className="grid sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-100 dark:border-zinc-800">
            <article>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-50 mb-3">Skills offered</h3>
              <ul className="space-y-2">
                {user.offeredSkills?.length ? user.offeredSkills.map((s) => (
                  <li key={s.name} className="flex justify-between text-sm"><span>{s.name}</span><Badge variant="outline" className="capitalize">{s.level}</Badge></li>
                )) : <li className="text-sm text-slate-500">None listed</li>}
              </ul>
            </article>
            <article>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-50 mb-3">Skills requested</h3>
              <ul className="space-y-2">
                {user.requestedSkills?.length ? user.requestedSkills.map((s) => (
                  <li key={s.name} className="flex justify-between text-sm"><span>{s.name}</span><Badge variant="outline" className="capitalize">{s.level}</Badge></li>
                )) : <li className="text-sm text-slate-500">None listed</li>}
              </ul>
            </article>
          </section>
          {user.badges?.length > 0 && <section className="mt-6"><BadgeDisplay badges={user.badges} /></section>}
        </Card>
        <Card>
          <CardHeader title="Reputation" />
          <ProgressRing value={user.trustScore} max={100} label={String(user.trustScore)} sublabel="Trust score" />
        </Card>
      </section>
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Reviews</h2>
        <div className="space-y-4">
          {reviews.length ? reviews.map((r) => <ReviewCard key={r._id} review={r} />) : <p className="text-sm text-slate-500">No reviews yet</p>}
        </div>
      </section>
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit profile" size="lg">
        <ProfileForm form={form} onChange={(e) => {
          const { name, value } = e.target;
          if (name === 'languages') setForm({ ...form, languages: value.split(',').map((l) => l.trim()) });
          else setForm({ ...form, [name]: value });
        }} onSubmit={saveProfile} loading={saving} />
      </Modal>
    </DashboardLayout>
  );
}
