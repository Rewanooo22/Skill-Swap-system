import { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import NotificationItem from '../components/NotificationItem';
import EmptyState from '../components/ui/EmptyState';
import { Bell } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/notifications').then(({ data }) => setNotifications(data.notifications)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  return (
    <DashboardLayout title="Notifications" description="Stay updated on matches, sessions, and messages">
      <header className="flex justify-end mb-4">
        <Button variant="secondary" size="sm" onClick={() => api.put('/notifications/read-all').then(load)}>Mark all read</Button>
      </header>
      <Card className="!p-0 overflow-hidden">
        {loading ? <p className="p-8 text-sm text-slate-500">Loading...</p> : notifications.length ? (
          notifications.map((n) => <NotificationItem key={n._id} notification={n} onRead={() => api.put(`/notifications/${n._id}/read`).then(load)} />)
        ) : (
          <EmptyState icon={Bell} title="All caught up" message="You have no notifications" />
        )}
      </Card>
    </DashboardLayout>
  );
}
