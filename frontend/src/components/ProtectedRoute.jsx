import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatCardSkeleton } from './ui/Skeleton';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-8">
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </section>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
