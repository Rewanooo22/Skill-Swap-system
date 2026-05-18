import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Skill from '../src/models/Skill.js';
import Badge from '../src/models/Badge.js';
import Session from '../src/models/Session.js';

const uri =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/skillswap';

const badges = [
  {
    name: 'First Swap',
    description: 'Complete your first skill swap',
    icon: '🎯',
    pointsRequired: 0,
  },
  {
    name: 'Skill Master',
    description: 'Complete 10 skill swaps',
    icon: '🏆',
    pointsRequired: 0,
  },
  {
    name: 'Rising Star',
    description: 'Earn 200 points',
    icon: '⭐',
    pointsRequired: 200,
  },
  {
    name: 'Trusted Trader',
    description: 'Reach 80 trust score',
    icon: '🛡️',
    pointsRequired: 0,
  },
];

async function seed() {
  await mongoose.connect(uri);

  console.log('MongoDB Connected');
  console.log('Seeding database...');

  await Promise.all([
    User.deleteMany(),
    Skill.deleteMany(),
    Badge.deleteMany(),
    Session.deleteMany(),
  ]);

  const badgeDocs = await Badge.insertMany(badges);

  const users = await User.create([
    {
      name: 'Alex Rivera',
      email: 'alex@skillswap.com',
      password: 'password123',
      bio: 'Full-stack developer passionate about teaching web development.',
      location: 'New York, NY',
      languages: ['English', 'Spanish'],
      offeredSkills: [
        { name: 'React', level: 'advanced' },
        { name: 'Node.js', level: 'advanced' },
      ],
      requestedSkills: [
        { name: 'Guitar', level: 'beginner' },
        { name: 'Spanish', level: 'intermediate' },
      ],
      trustScore: 85,
      points: 250,
      averageRating: 4.8,
      reviewCount: 12,
      role: 'admin',
      availability: [
        {
          day: 'sat',
          slots: [{ start: '10:00', end: '14:00' }],
        },
      ],
    },

    {
      name: 'Jordan Lee',
      email: 'jordan@skillswap.com',
      password: 'password123',
      bio: 'Music teacher and language enthusiast.',
      location: 'New York, NY',
      languages: ['English', 'French'],
      offeredSkills: [
        { name: 'Guitar', level: 'expert' },
        { name: 'French', level: 'advanced' },
      ],
      requestedSkills: [
        { name: 'React', level: 'beginner' },
        { name: 'Photography', level: 'intermediate' },
      ],
      trustScore: 78,
      points: 180,
      averageRating: 4.5,
      reviewCount: 8,
      availability: [
        {
          day: 'sat',
          slots: [{ start: '11:00', end: '15:00' }],
        },
      ],
    },

    {
      name: 'Sam Patel',
      email: 'sam@skillswap.com',
      password: 'password123',
      bio: 'Photographer and design mentor.',
      location: 'San Francisco, CA',
      languages: ['English', 'Hindi'],
      offeredSkills: [
        { name: 'Photography', level: 'advanced' },
        { name: 'UI Design', level: 'intermediate' },
      ],
      requestedSkills: [{ name: 'Cooking', level: 'beginner' }],
      trustScore: 72,
      points: 120,
      averageRating: 4.2,
      reviewCount: 5,
    },
  ]);

  await User.findByIdAndUpdate(users[0]._id, {
    badges: [badgeDocs[2]._id],
  });

  const skills = await Skill.insertMany([
    {
      title: 'React Fundamentals Workshop',
      description:
        'Learn React hooks, components, and state management in a hands-on session.',
      skillLevel: 'beginner',
      mode: 'online',
      estimatedDuration: 90,
      tags: ['react', 'javascript', 'web'],
      owner: users[0]._id,
      type: 'offered',
      location: 'New York, NY',
    },

    {
      title: 'Guitar for Beginners',
      description:
        'Start your guitar journey with chords, strumming, and your first song.',
      skillLevel: 'beginner',
      mode: 'both',
      estimatedDuration: 60,
      tags: ['music', 'guitar', 'creative'],
      owner: users[1]._id,
      type: 'offered',
      location: 'New York, NY',
    },

    {
      title: 'Photography Composition',
      description:
        'Master rule of thirds, lighting, and storytelling through photos.',
      skillLevel: 'intermediate',
      mode: 'offline',
      estimatedDuration: 120,
      tags: ['photography', 'art', 'creative'],
      owner: users[2]._id,
      type: 'offered',
      location: 'San Francisco, CA',
    },

    {
      title: 'Looking to Learn Spanish',
      description:
        'Conversational Spanish for travel and daily use.',
      skillLevel: 'beginner',
      mode: 'online',
      estimatedDuration: 45,
      tags: ['language', 'spanish'],
      owner: users[0]._id,
      type: 'requested',
    },
  ]);

  console.log('Seed complete!');
  console.log('Admin Login: alex@skillswap.com / password123');
  console.log(
    `Created ${users.length} users, ${skills.length} skills, and ${badgeDocs.length} badges`
  );

  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed Error:', error);
  process.exit(1);
});