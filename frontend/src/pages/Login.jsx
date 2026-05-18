import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!email) err.email = 'Email is required';
    if (!password) err.password = 'Password is required';
    if (Object.keys(err).length) return setErrors(err);
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto">
        <Card>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-zinc-50">Sign in</h1>
          <p className="text-sm text-slate-500 mt-1 mb-8">Access your Skill Swap account</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
            <Button type="submit" className="w-full" loading={loading}>Sign in</Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            No account? <Link to="/register" className="text-brand-600 font-medium hover:underline">Register</Link>
          </p>
        </Card>
      </div>
    </PublicLayout>
  );
}
