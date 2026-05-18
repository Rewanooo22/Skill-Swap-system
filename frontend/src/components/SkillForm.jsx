import Input, { Select, Textarea } from './ui/Input';
import Button from './ui/Button';

export default function SkillForm({ form, onChange, onSubmit, submitLabel = 'Save skill', loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Title" name="title" value={form.title || ''} onChange={onChange} required />
      <Textarea label="Description" name="description" value={form.description || ''} onChange={onChange} required rows={4} />
      <Input label="Tags" name="tags" value={form.tags || ''} onChange={onChange} hint="Comma separated" />
      <Input label="Location" name="location" value={form.location || ''} onChange={onChange} />
      <Select label="Skill level" name="skillLevel" value={form.skillLevel || 'intermediate'} onChange={onChange}>
        {['beginner', 'intermediate', 'advanced', 'expert'].map((l) => <option key={l} value={l} className="capitalize">{l}</option>)}
      </Select>
      <Select label="Mode" name="mode" value={form.mode || 'online'} onChange={onChange}>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
        <option value="both">Both</option>
      </Select>
      <Select label="Listing type" name="type" value={form.type || 'offered'} onChange={onChange}>
        <option value="offered">Offering to teach</option>
        <option value="requested">Looking to learn</option>
      </Select>
      <Input label="Duration (minutes)" type="number" name="estimatedDuration" value={form.estimatedDuration || 60} onChange={onChange} min={15} />
      <Button type="submit" className="w-full" loading={loading}>{submitLabel}</Button>
    </form>
  );
}
