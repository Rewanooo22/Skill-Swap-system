import Card from './ui/Card';
import Avatar from './ui/Avatar';
import { Star } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function ReviewCard({ review }) {
  return (
    <Card className="!p-5">
      <header className="flex items-center gap-3">
        <Avatar src={review.reviewer?.profilePhoto} name={review.reviewer?.name} />
        <section className="flex-1">
          <p className="font-medium text-slate-900 dark:text-zinc-50">{review.reviewer?.name}</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 dark:text-zinc-700'}`} />
            ))}
          </div>
        </section>
        <time className="text-xs text-slate-400">{formatDate(review.createdAt)}</time>
      </header>
      {review.comment && <p className="text-sm text-slate-600 dark:text-zinc-400 mt-3 leading-relaxed">{review.comment}</p>}
    </Card>
  );
}
