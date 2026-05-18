import { Calendar, Video, MapPin } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { formatDateTime } from '../lib/utils';

const statusVariant = {
  proposed: 'warning',
  accepted: 'success',
  rejected: 'danger',
  cancelled: 'outline',
  completed: 'brand',
};

export default function SessionCard({ session, currentUserId, onRespond, onCancel, onComplete }) {
  const isGuest = session.guest?._id === currentUserId || session.guest === currentUserId;
  const isHost = session.host?._id === currentUserId || session.host === currentUserId;
  const other = isHost ? session.guest : session.host;

  return (
    <Card className="!p-5">
      <header className="flex justify-between items-start gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-zinc-50">{session.title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">with {other?.name || 'User'}</p>
        </div>
        <Badge variant={statusVariant[session.status]} className="capitalize shrink-0">{session.status}</Badge>
      </header>
      <section className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDateTime(session.proposedTime)}</span>
        <span>{session.duration} min</span>
        <span className="flex items-center gap-1.5 capitalize">
          {session.mode === 'online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
          {session.mode}
        </span>
      </section>
      {session.notes && <p className="text-sm text-slate-500 mb-4 pb-4 border-b border-slate-100 dark:border-zinc-800">{session.notes}</p>}
      <footer className="flex gap-2 flex-wrap">
        {session.status === 'proposed' && isGuest && onRespond && (
          <>
            <Button size="sm" onClick={() => onRespond(session._id, 'accept')}>Accept</Button>
            <Button size="sm" variant="secondary" onClick={() => onRespond(session._id, 'reject')}>Decline</Button>
          </>
        )}
        {['proposed', 'accepted'].includes(session.status) && (isHost || isGuest) && onCancel && (
          <Button size="sm" variant="ghost" onClick={() => onCancel(session._id)}>Cancel</Button>
        )}
        {session.status === 'accepted' && onComplete && (
          <Button size="sm" variant="accent" onClick={() => onComplete(session._id)}>Mark complete</Button>
        )}
      </footer>
    </Card>
  );
}
