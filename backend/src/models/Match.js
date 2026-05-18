import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, default: 0 },
    reasons: [{ type: String }],
    status: { type: String, enum: ['suggested', 'viewed', 'connected'], default: 'suggested' },
  },
  { timestamps: true }
);

matchSchema.index({ user: 1, matchedUser: 1 }, { unique: true });

export default mongoose.model('Match', matchSchema);
