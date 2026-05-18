import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import connectDB from './src/config/db.js';
import { errorHandler } from './src/middleware/errorHandler.js';

import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import skillRoutes from './src/routes/skillRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import sessionRoutes from './src/routes/sessionRoutes.js';
import messageRoutes from './src/routes/messageRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import badgeRoutes from './src/routes/badgeRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
  },
});

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/badges', badgeRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Skill Swap API running',
  });
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on('send_message', (data) => {
    io.to(`user_${data.receiverId}`).emit('new_message', data);
  });

  socket.on('disconnect', () => {});
});

// Serve Frontend in Production
const frontendPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.set('io', io);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });