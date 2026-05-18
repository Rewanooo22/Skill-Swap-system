import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const skillRefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' },
});

const availabilitySchema = new mongoose.Schema({
  day: { type: String, enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
  slots: [{ start: String, end: String }],
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    bio: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    location: { type: String, default: '' },
    availability: [availabilitySchema],
    languages: [{ type: String }],
    offeredSkills: [skillRefSchema],
    requestedSkills: [skillRefSchema],
    trustScore: { type: Number, default: 50, min: 0, max: 100 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isSuspended: { type: Boolean, default: false },
    milestones: {
      firstSwap: { type: Boolean, default: false },
      tenSwaps: { type: Boolean, default: false },
    },
    completedSessions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model('User', userSchema);
