import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import SkillForm from '../components/SkillForm';
import { useToast } from '../context/ToastContext';

export default function CreateSkill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ skillLevel: 'intermediate', mode: 'online', type: 'offered', estimatedDuration: 60 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) api.get(`/skills/${id}`).then(({ data }) => {
      const s = data.skill;
      setForm({ ...s, tags: s.tags?.join(', ') });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'estimatedDuration' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, tags: (form.tags || '').split(',').map((t) => t.trim()).filter(Boolean) };
    try {
      if (id) await api.put(`/skills/${id}`, payload);
      else await api.post('/skills', payload);
      toast.success(id ? 'Skill updated' : 'Skill created');
      navigate('/search');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title={id ? 'Edit skill' : 'Create skill'} description="Publish a skill card to the exchange">
      <Card className="max-w-lg">
        <SkillForm form={form} onChange={handleChange} onSubmit={handleSubmit} loading={loading} submitLabel={id ? 'Update skill' : 'Publish skill'} />
      </Card>
    </DashboardLayout>
  );
}
