import { useEffect, useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import SkillCard from '../components/SkillCard';
import Card from '../components/ui/Card';
import Input, { Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { SkillCardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Search() {
  const { user } = useAuth();
  const toast = useToast();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', tags: '', location: '', mode: '', type: '' });
  const [favorites, setFavorites] = useState([]);

  const fetchSkills = () => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    api.get(`/skills?${params}`).then(({ data }) => setSkills(data.skills)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchSkills(); }, []);
  useEffect(() => {
    if (user) api.get('/skills/favorites/list').then(({ data }) => setFavorites(data.skills.map((s) => s._id)));
  }, [user]);

  const handleFavorite = async (skillId) => {
    const { data } = await api.post(`/skills/${skillId}/favorite`);
    setFavorites(data.favorites.map(String));
    toast.success(data.favorited ? 'Saved to bookmarks' : 'Removed from bookmarks');
  };

  return (
    <DashboardLayout title="Explore skills" description="Search and filter the skill exchange catalog">
      <Card className="mb-6 !p-4">
        <form onSubmit={(e) => { e.preventDefault(); fetchSkills(); }} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          <Input placeholder="Search..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="lg:col-span-2" />
          <Input placeholder="Tags" value={filters.tags} onChange={(e) => setFilters({ ...filters, tags: e.target.value })} />
          <Input placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
          <Select value={filters.mode} onChange={(e) => setFilters({ ...filters, mode: e.target.value })}>
            <option value="">All modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </Select>
          <Button type="submit" icon={SearchIcon}>Search</Button>
        </form>
      </Card>
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <SkillCardSkeleton key={i} />)}</div>
      ) : skills.length ? (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((s, i) => <SkillCard key={s._id} skill={s} index={i} onFavorite={user ? handleFavorite : null} isFavorited={favorites.includes(s._id)} />)}
        </section>
      ) : (
        <EmptyState icon={SlidersHorizontal} title="No skills found" message="Try adjusting your search filters" action={<Button onClick={fetchSkills}>Clear filters</Button>} />
      )}
    </DashboardLayout>
  );
}
