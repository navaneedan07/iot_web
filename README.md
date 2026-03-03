# scoreme

Full-stack scaffold for an anonymous scoring platform with ML moderation.

## Stack
- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express + PostgreSQL
- Auth: JWT, bcrypt
- Moderation: Google Gemini API (text prompts)

## Local development (no Docker)
Prereqs: Node 20+, npm, PostgreSQL running locally with database/user `scoreme/scoreme` (or update `DATABASE_URL`).

Backend:
```bash
cd backend
npm install
cp .env.example .env # add GEMINI_API_KEY
npm run dev
npm run seed # optional: load demo data
```

Frontend:
```bash
cd frontend
npm install
npm run dev # set VITE_API_URL=http://localhost:4000 if needed
```

## Database schema
See backend/src/db/schema.sql for enums, constraints, indices, moderation logs, anomalies, battles, ratings, rank history.

## API
- /auth (register, login)
- /users (profile, update, rank history)
- /posts (upload with moderation, list, report)
- /ratings (one-per-user per post, weighted scoring)
- /leaderboard (global/college/city)
- /battles (create, vote)
- /admin (delete posts, flag users/posts)

## Status score logic
- Per-post weighted score on dimensions (presence, aesthetic, authority, intelligence, discipline) with equal weights.
- User status score: time-decayed average of last 5 post scores.
- Percentile + leaderboard snapshot placeholders in services/leaderboardService.js.

## Seed data
Run `npm run seed` in backend to create base user demo@scoreme.app / password123 and a sample post.

## Frontend pages
- Feed: latest moderated posts
- Upload: category + caption + media upload
- Profile: user info + rank history
- Leaderboard: scope switcher
- Battle: simple head-to-head voting
- Analytics: premium placeholders

## Security & moderation
- Rate limiting, Helmet, file type/size checks
- ML moderation calls before accepting posts (fallback to REVIEW)
- Report endpoint, admin delete/flag

## Next steps
- Use Gemini safety signals to drive stricter moderation
- Add percentile + weekly leaderboard job (cron/worker)
- Implement anomaly detection endpoint logic
- Add proper auth flows on frontend (login/register forms)
- Add charts (e.g., Chart.js/Recharts) for analytics
```
