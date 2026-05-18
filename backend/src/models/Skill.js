import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' },
    mode: { type: String, enum: ['online', 'offline', 'both'], default: 'online' },
    estimatedDuration: { type: Number, default: 60 },
    tags: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['offered', 'requested'], default: 'offered' },
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

skillSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Skill', skillSchema);
