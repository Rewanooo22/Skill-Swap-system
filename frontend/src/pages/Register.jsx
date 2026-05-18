import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name) err.name = 'Name is required';
    if (!form.email) err.email = 'Email is required';
    if (form.password.length < 6) err.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) err.confirm = 'Passwords must match';
    if (Object.keys(err).length) return setErrors(err);
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-md mx-auto">
        <Card>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-zinc-50">Create account</h1>
          <p className="text-sm text-slate-500 mt-1 mb-8">Join the skill exchange network</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input label="Email" type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <Input label="Password" type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
            <Input label="Confirm password" type="password" name="confirm" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} error={errors.confirm} />
            <Button type="submit" className="w-full" loading={loading}>Create account</Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            Have an account? <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </Card>
      </div>
    </PublicLayout>
  );
}
