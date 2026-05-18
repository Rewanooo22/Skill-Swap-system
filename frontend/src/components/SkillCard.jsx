import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Clock, MapPin, Monitor, Users } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';
import { cn } from '../lib/utils';

const levelVariant = { beginner: 'outline', intermediate: 'default', advanced: 'brand', expert: 'success' };
const modeIcon = { online: Monitor, offline: MapPin, both: Users };

export default function SkillCard({ skill, onFavorite, isFavorited, index = 0 }) {
  const owner = skill.owner;
  const ModeIcon = modeIcon[skill.mode] || Monitor;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card hover className="flex flex-col h-full !p-0 overflow-hidden group">
        <section className="p-5 flex-1 flex flex-col">
          <header className="flex items-start justify-between gap-2 mb-3">
            <Badge variant={skill.type === 'offered' ? 'success' : 'brand'}>
              {skill.type === 'offered' ? 'Offering' : 'Seeking'}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-slate-500 capitalize">
              <ModeIcon className="w-3.5 h-3.5" />
              {skill.mode}
            </span>
          </header>
          <Link to={`/skills/${skill._id}`} className="block group-hover:text-brand-600 transition-colors">
            <h3 className="font-semibold text-slate-900 dark:text-zinc-50 line-clamp-1">{skill.title}</h3>
          </Link>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mt-2 line-clamp-2 flex-1">{skill.description}</p>
          <section className="flex flex-wrap gap-1.5 mt-4">
            <Badge variant={levelVariant[skill.skillLevel] || 'default'} className="capitalize">{skill.skillLevel}</Badge>
            {skill.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </section>
        </section>
        <footer className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-900/50">
          <Link to={`/profile/${owner?._id}`} className="flex items-center gap-2 min-w-0">
            <Avatar src={owner?.profilePhoto} name={owner?.name} size="sm" />
            <span className="text-sm text-slate-700 dark:text-zinc-300 truncate">{owner?.name}</span>
          </Link>
          <section className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {skill.estimatedDuration}m
            </span>
            {onFavorite && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); onFavorite(skill._id); }}
                className={cn('p-1.5 rounded-lg transition-colors', isFavorited ? 'text-brand-600 bg-brand-50 dark:bg-brand-950/30' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800')}
                aria-label={isFavorited ? 'Remove bookmark' : 'Bookmark'}
              >
                <Bookmark className={cn('w-4 h-4', isFavorited && 'fill-current')} />
              </button>
            )}
          </section>
        </footer>
      </Card>
    </motion.div>
  );
}
