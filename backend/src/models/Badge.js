import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '🏅' },
    criteria: { type: String, default: '' },
    pointsRequired: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Badge', badgeSchema);
