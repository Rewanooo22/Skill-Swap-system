# Skill Swap App

A crowdsourced skill exchange platform where users teach and learn skills without money.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Auth:** JWT + bcrypt
- **Realtime:** Socket.io (messaging)

## Project Structure

```
software/
├── backend/
│   ├── server.js
│   ├── seed/seed.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── utils/
└── frontend/
    └── src/
        ├── components/   # Reusable UI classes
        ├── pages/        # Route pages
        ├── context/
        └── services/
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally

### Backend

```bash
cd backend
npm install
cp .env.example .env   # or use existing .env
npm run seed           # optional: load demo data
npm run dev
```

API runs at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| alex@skillswap.com | password123 | Admin |
| jordan@skillswap.com | password123 | User |
| sam@skillswap.com | password123 | User |

## Frontend Components (Classes)

| Component | Purpose |
|-----------|---------|
| `Layout` | Page wrapper with navbar |
| `Navbar` | Navigation + auth state |
| `ProtectedRoute` | Auth guard |
| `SkillCard` | Skill listing card |
| `UserCard` | Match candidate card |
| `SessionCard` | Session with actions |
| `ReviewCard` | Review display |
| `NotificationItem` | Notification row |
| `BadgeDisplay` | Badge chips |
| `SkillForm` | Create/edit skill form |
| `ProfileForm` | Edit profile form |
| `Modal` | Dialog overlay |
| `LoadingSpinner` | Loading state |
| `EmptyState` | Empty list placeholder |

## API Routes

- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/skills` — Browse/search skills
- `GET /api/matches` — Matchmaking suggestions
- `GET /api/sessions` — User sessions
- `GET /api/messages/conversations` — Chat list
- `GET /api/admin/stats` — Admin statistics
# Skill-Swap-system
