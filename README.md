<div align="center">

# ScoreMe

**Campus Feedback & Social Scoring Platform**

A full-stack web application where college students upload media, receive community ratings across multiple dimensions, compete in head-to-head battles, and climb leaderboards.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Features

- **Media Upload** — Post images/videos across 18 categories (Gym Transformation, OOTD, Study Setup, etc.)
- **Multi-Dimension Rating** — Community rates posts on Presence, Aesthetic, Authority, Intelligence & Discipline
- **AI Moderation** — Google Gemini integration flags inappropriate content before it goes live
- **Head-to-Head Battles** — Auto-matched posts compete for community votes
- **Leaderboards** — Global, college & city scopes with live percentile ranking
- **Profile Management** — Edit bio, college, city; view rank history & stats
- **Analytics Dashboard** — Posting trends, rating distributions, category breakdowns
- **Comments** — Threaded comment system on every post
- **Account Management** — Full profile editing & account deletion with CASCADE cleanup
- **Post Management** — Owners can delete their own posts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router 6 |
| **Backend** | Node.js 20, Express 4, JWT Authentication |
| **Database** | PostgreSQL 16 with UUID primary keys |
| **AI/ML** | Google Gemini API (content moderation) |
| **Fonts** | Inter (body) + Outfit (headings) |
| **Deployment** | Docker Compose (Nginx + Node + PostgreSQL) |

## Project Structure

```
scoreme/
├── backend/
│   ├── src/
│   │   ├── app.js              # Express app setup
│   │   ├── server.js           # Entry point
│   │   ├── db/
│   │   │   ├── pool.js         # PostgreSQL connection pool
│   │   │   ├── schema.sql      # Full database schema
│   │   │   └── seed.js         # Demo data seeder
│   │   ├── middleware/
│   │   │   ├── auth.js         # JWT auth middleware
│   │   │   ├── errorHandler.js # Global error handler
│   │   │   └── validate.js     # Joi validation middleware
│   │   ├── routes/             # Express routers
│   │   ├── services/           # Business logic layer
│   │   └── utils/
│   └── uploads/                # User-uploaded media
├── frontend/
│   ├── src/
│   │   ├── api.js              # Axios instance
│   │   ├── App.jsx             # Router & layout
│   │   ├── data/categories.js  # 18 post categories
│   │   └── pages/              # React page components
│   └── index.html
├── docker-compose.yml          # Full-stack deployment
├── nginx.conf                  # Reverse proxy config
├── deploy.sh                   # One-command VM deployment
└── .env.example                # Environment template
```

## Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** (or Docker)
- **npm** 9+

### Local Development

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env          # fill in your values
npm run seed                  # optional: seed demo data
npm run dev                   # starts on port 4000
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev                   # starts on port 5173, proxies /api → :4000
```

### Docker Deployment (Production)

```bash
cp .env.example .env          # fill in production values
docker compose up -d --build  # builds & starts all 3 services
```

Or use the automated deploy script on an Ubuntu VM:
```bash
chmod +x deploy.sh
./deploy.sh                   # installs Docker, generates secrets, builds & starts
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `4000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://scoreme:scoreme@localhost:5432/scoreme` |
| `JWT_SECRET` | JWT signing secret | `changeme-super-secret` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `UPLOAD_DIR` | Media upload directory | `./uploads` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |
| `MODERATION_ENABLED` | Enable AI moderation | `false` |
| `GEMINI_API_KEY` | Google Gemini API key | — |
| `GEMINI_MODEL` | Gemini model name | `gemini-1.5-flash` |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | — | Register (email, username, password, college?, city?) |
| `POST` | `/auth/login` | — | Login → JWT token |
| `GET` | `/users/me` | Yes | Get profile + live stats |
| `PUT` | `/users/me` | Yes | Update profile |
| `DELETE` | `/users/me` | Yes | Delete account (CASCADE) |
| `GET` | `/users/me/rank-history` | Yes | Rank history entries |
| `GET` | `/posts` | — | Feed (paginated, with scores) |
| `POST` | `/posts` | Yes | Upload post (multipart, AI moderated) |
| `DELETE` | `/posts/:id` | Yes | Delete own post |
| `POST` | `/ratings` | Yes | Rate a post (1-10, 5 dimensions) |
| `GET` | `/leaderboard` | — | Rankings (scope: global/college/city) |
| `POST` | `/battles/auto-match` | Yes | Create auto-matched battle |
| `GET` | `/battles` | — | List active battles |
| `POST` | `/battles/:id/vote` | Yes | Vote in a battle |
| `GET` | `/comments/:postId` | — | Get post comments |
| `POST` | `/comments/:postId` | Yes | Add comment |
| `GET` | `/analytics/overview` | Yes | Platform analytics |
| `GET` | `/health` | — | Health check |

## Scoring System

1. **Post Score** — Weighted average across 5 dimensions (Presence, Aesthetic, Authority, Intelligence, Discipline)
2. **User Status Score** — Time-decayed average of latest post scores
3. **Percentile Rank** — Computed live among all scored users after each rating
4. **Leaderboard** — Filterable by global, college, or city scope

## Security

- **JWT authentication** with bcrypt password hashing
- **Helmet** security headers
- **Rate limiting** (configurable window + max)
- **AI content moderation** via Google Gemini (flagged → REVIEW queue)
- **File validation** — type + size checks on upload
- **Input validation** — Joi schemas on all endpoints
- **CORS** protection
- **Sensitive data** — `.env` excluded from git, secrets auto-generated on deploy

## Deployment Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Nginx     │─────▶│   Express    │─────▶│  PostgreSQL  │
│  (port 80)  │      │  (port 4000) │      │  (port 5432) │
│  SPA + proxy│      │  REST API    │      │  Data store  │
└─────────────┘      └──────────────┘      └──────────────┘
```

All three services run as Docker containers via `docker-compose.yml`.

## License

MIT
```
