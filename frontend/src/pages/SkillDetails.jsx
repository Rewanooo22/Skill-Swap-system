import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bookmark, Clock, MessageSquare, Pencil } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { SkillCardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

export default function SkillDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [skill, setSkill] = useState(null);
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    api.get(`/skills/${id}`).then(({ data }) => setSkill(data.skill));
  }, [id]);

  const toggleFavorite = async () => {
    const { data } = await api.post(`/skills/${id}/favorite`);
    setFavorited(data.favorited);
    toast.success(data.favorited ? 'Bookmarked' : 'Removed bookmark');
  };

  if (!skill) return <DashboardLayout title="Skill"><SkillCardSkeleton /></DashboardLayout>;

  const owner = skill.owner;
  const isOwner = user?._id === owner?._id;

  return (
    <DashboardLayout title={skill.title}>
      <Card className="max-w-3xl">
        <header className="flex justify-between items-start gap-4 mb-6">
          <div className="flex gap-2">
            <Badge variant={skill.type === 'offered' ? 'success' : 'brand'}>{skill.type === 'offered' ? 'Offering' : 'Seeking'}</Badge>
            <Badge variant="outline" className="capitalize">{skill.mode}</Badge>
            <Badge variant="brand" className="capitalize">{skill.skillLevel}</Badge>
          </div>
          {user && !isOwner && (
            <button type="button" onClick={toggleFavorite} className={cn('p-2 rounded-lg border transition-colors', favorited ? 'border-brand-600 text-brand-600' : 'border-slate-200 text-slate-400')}>
              <Bookmark className={cn('w-5 h-5', favorited && 'fill-current')} />
            </button>
          )}
        </header>
        <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{skill.description}</p>
        <section className="grid sm:grid-cols-3 gap-4 mt-8 py-6 border-y border-slate-100 dark:border-zinc-800 text-sm">
          <div><p className="text-slate-500 text-xs uppercase tracking-wide">Duration</p><p className="font-medium mt-1 flex items-center gap-1"><Clock className="w-4 h-4" />{skill.estimatedDuration} min</p></div>
          <div><p className="text-slate-500 text-xs uppercase tracking-wide">Location</p><p className="font-medium mt-1">{skill.location || 'Flexible'}</p></div>
          <div><p className="text-slate-500 text-xs uppercase tracking-wide">Mode</p><p className="font-medium mt-1 capitalize">{skill.mode}</p></div>
        </section>
        <section className="flex flex-wrap gap-2 mt-4">
          {skill.tags?.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
        </section>
        <footer className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800">
          <Link to={`/profile/${owner?._id}`} className="flex items-center gap-3">
            <Avatar src={owner?.profilePhoto} name={owner?.name} />
            <div><p className="font-medium text-sm">{owner?.name}</p><p className="text-xs text-slate-500">Trust {owner?.trustScore}</p></div>
          </Link>
          <div className="flex gap-2">
            {isOwner ? <Link to={`/skills/edit/${id}`}><Button variant="secondary" icon={Pencil}>Edit</Button></Link> : user && (
              <Link to={`/messages/${owner?._id}`}><Button icon={MessageSquare}>Message</Button></Link>
            )}
          </div>
        </footer>
      </Card>
    </DashboardLayout>
  );
}
