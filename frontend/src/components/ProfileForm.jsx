import Input, { Textarea } from './ui/Input';
import Button from './ui/Button';

export default function ProfileForm({ form, onChange, onSubmit, loading }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Name" name="name" value={form.name || ''} onChange={onChange} required />
      <Textarea label="Bio" name="bio" value={form.bio || ''} onChange={onChange} rows={4} />
      <Input label="Location" name="location" value={form.location || ''} onChange={onChange} />
      <Input
        label="Languages"
        name="languages"
        value={Array.isArray(form.languages) ? form.languages.join(', ') : form.languages || ''}
        onChange={onChange}
        hint="Comma separated"
      />
      <Input
        label="Skills offered"
        name="offeredSkillsText"
        value={form.offeredSkillsText || ''}
        onChange={onChange}
        hint="Format: React:advanced, Design:intermediate"
      />
      <Input
        label="Skills requested"
        name="requestedSkillsText"
        value={form.requestedSkillsText || ''}
        onChange={onChange}
        hint="Format: Spanish:beginner"
      />
      <Button type="submit" className="w-full" loading={loading}>Save profile</Button>
    </form>
  );
}
