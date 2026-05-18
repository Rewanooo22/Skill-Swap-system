import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Select, Textarea } from '../components/ui/Input';
import { useToast } from '../context/ToastContext';

export default function Reviews() {
  const [params] = useSearchParams();
  const sessionId = params.get('session');
  const toast = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionId) return toast.error('Session ID required');
    setLoading(true);
    try {
      await api.post('/reviews', { sessionId, rating, comment });
      toast.success('Review submitted');
      setDone(true);
    } catch {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Leave a review" description="Share feedback after a completed session">
      <Card className="max-w-md">
        {done ? (
          <p className="text-sm text-slate-600">Thank you. Your review helps build trust across the network.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select label="Rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} out of 5</option>)}
            </Select>
            <Textarea label="Comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
            <Button type="submit" className="w-full" loading={loading} disabled={!sessionId}>Submit review</Button>
          </form>
        )}
      </Card>
    </DashboardLayout>
  );
}
