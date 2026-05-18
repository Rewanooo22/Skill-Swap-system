import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import SessionCard from '../components/SessionCard';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Input, { Textarea, Select } from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import { Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function Sessions() {
  const { user } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposeOpen, setProposeOpen] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [form, setForm] = useState({
    title: '', guest: location.state?.guest || '', date: '', time: '10:00', duration: 60, mode: 'online', notes: '',
  });

  const load = () => api.get('/sessions').then(({ data }) => setSessions(data.sessions)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handlePropose = async (e) => {
    e.preventDefault();
    const proposedTime = new Date(`${form.date}T${form.time}`);
    await api.post('/sessions', { title: form.title, guest: form.guest, proposedTime, duration: form.duration, mode: form.mode, notes: form.notes });
    toast.success('Session proposed');
    setProposeOpen(false);
    load();
  };

  const respond = async (id, action) => {
    await api.put(`/sessions/${id}/respond`, { action });
    toast.success(action === 'accept' ? 'Session accepted' : 'Session declined');
    load();
  };

  const cancel = async () => {
    await api.put(`/sessions/${cancelId}/cancel`);
    toast.info('Session cancelled');
    setCancelId(null);
    load();
  };

  const complete = async (id) => {
    await api.put(`/sessions/${id}/complete`);
    toast.success('Session marked complete');
    load();
  };

  const upcoming = sessions.filter((s) => ['proposed', 'accepted'].includes(s.status));
  const past = sessions.filter((s) => ['completed', 'cancelled', 'rejected'].includes(s.status));

  return (
    <DashboardLayout title="Sessions" description="Manage proposals and scheduled skill swaps">
      <header className="flex justify-end mb-6">
        <Button icon={Calendar} onClick={() => setProposeOpen(true)}>Propose session</Button>
      </header>
      <section className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-50 mb-4">Active & upcoming</h2>
          {loading ? <p className="text-sm text-slate-500">Loading...</p> : upcoming.length ? (
            <section className="space-y-4">{upcoming.map((s) => (
              <SessionCard key={s._id} session={s} currentUserId={user._id} onRespond={respond} onCancel={setCancelId} onComplete={complete} />
            ))}</section>
          ) : <EmptyState icon={Calendar} title="No active sessions" message="Propose a session to get started" />}
        </Card>
        <Card>
          <h2 className="text-sm font-semibold mb-4">Select time</h2>
          <p className="text-xs text-slate-500 mb-3">Quick slots when proposing</p>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((t) => (
              <button key={t} type="button" onClick={() => setForm({ ...form, time: t })} className={`py-2 text-sm rounded-lg border transition-colors ${form.time === t ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950/30' : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </Card>
      </section>
      {past.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold mb-4 text-slate-500">History</h2>
          <section className="space-y-4 max-w-3xl">{past.map((s) => <SessionCard key={s._id} session={s} currentUserId={user._id} />)}</section>
        </section>
      )}
      <Modal open={proposeOpen} onClose={() => setProposeOpen(false)} title="Propose session" description="Send a session request to another member">
        <form onSubmit={handlePropose} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Guest user ID" value={form.guest} onChange={(e) => setForm({ ...form, guest: e.target.value })} required />
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <Select label="Mode" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
            <option value="online">Online</option>
            <option value="offline">In person</option>
          </Select>
          <Textarea label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
          <Button type="submit" className="w-full">Send proposal</Button>
        </form>
      </Modal>
      <ConfirmDialog open={!!cancelId} onClose={() => setCancelId(null)} onConfirm={cancel} title="Cancel session" description="This action cannot be undone. The other participant will be notified." confirmLabel="Cancel session" />
    </DashboardLayout>
  );
}
