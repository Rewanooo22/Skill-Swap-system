import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    reason: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['open', 'investigating', 'resolved', 'dismissed'], default: 'open' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
