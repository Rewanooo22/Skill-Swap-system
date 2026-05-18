import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    proposedTime: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    status: {
      type: String,
      enum: ['proposed', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'proposed',
    },
    mode: { type: String, enum: ['online', 'offline'], default: 'online' },
    notes: { type: String, default: '' },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Session', sessionSchema);
