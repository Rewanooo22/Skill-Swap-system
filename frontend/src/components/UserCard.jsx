import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Shield, Star } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

export default function UserCard({ user, score, reasons, onConnect, onProposeSession, index = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <Card className="!p-5">
        <header className="flex gap-4">
          <Avatar src={user.profilePhoto} name={user.name} size="lg" />
          <section className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link to={`/profile/${user._id}`} className="font-semibold text-slate-900 dark:text-zinc-50 hover:text-brand-600 truncate">
                {user.name}
              </Link>
              {score != null && (
                <Badge variant="brand" className="shrink-0 tabular-nums">{Math.round(score)}% match</Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{user.location || 'Location not set'}</p>
            <section className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" />{user.averageRating || '—'}</span>
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" />Trust {user.trustScore}</span>
            </section>
          </section>
        </header>
        <section className="flex flex-wrap gap-1.5 mt-4">
          {user.offeredSkills?.slice(0, 3).map((s) => (
            <Badge key={`o-${s.name}`} variant="success">Teaches {s.name}</Badge>
          ))}
          {user.requestedSkills?.slice(0, 2).map((s) => (
            <Badge key={`r-${s.name}`} variant="outline">Wants {s.name}</Badge>
          ))}
        </section>
        {reasons?.length > 0 && (
          <ul className="mt-3 space-y-1">
            {reasons.slice(0, 3).map((r) => (
              <li key={r} className="text-xs text-slate-500 flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        )}
        <footer className="flex gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800">
          {onConnect && <Button variant="secondary" size="sm" onClick={() => onConnect(user._id)}>Connect</Button>}
          {onProposeSession && (
            <Button variant="primary" size="sm" icon={Calendar} onClick={() => onProposeSession(user._id)}>Propose session</Button>
          )}
        </footer>
      </Card>
    </motion.div>
  );
}
