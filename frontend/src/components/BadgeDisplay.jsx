import Badge from './ui/Badge';
import { Award } from 'lucide-react';

export default function BadgeDisplay({ badges, earnedIds = [] }) {
  if (!badges?.length) return null;
  return (
    <section className="flex flex-wrap gap-2">
      {badges.map((badge) => {
        const b = typeof badge === 'object' ? badge : { _id: badge, name: 'Badge' };
        const earned = earnedIds.includes(b._id) || badge.name;
        return (
          <Badge key={b._id} variant={earned ? 'brand' : 'outline'} className="gap-1.5 py-1 px-2.5">
            <Award className="w-3 h-3" />
            {b.name}
          </Badge>
        );
      })}
    </section>
  );
}
