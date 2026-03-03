-- ENUMS
CREATE TYPE moderation_decision AS ENUM ('SAFE', 'REVIEW', 'REJECT');
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  college TEXT,
  city TEXT,
  profile_image TEXT,
  status_score NUMERIC(5,2) DEFAULT 0,
  percentile_rank NUMERIC(5,2) DEFAULT 0,
  premium BOOLEAN DEFAULT FALSE,
  role user_role DEFAULT 'USER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_college ON users(college);
CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);

-- POSTS
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL,
  category TEXT NOT NULL,
  caption TEXT,
  score NUMERIC(5,2) DEFAULT 0,
  ratings_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  moderation_status moderation_decision DEFAULT 'REVIEW',
  moderation_reason TEXT
);
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at);

-- RATINGS
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  presence SMALLINT CHECK(presence BETWEEN 0 AND 10),
  aesthetic SMALLINT CHECK(aesthetic BETWEEN 0 AND 10),
  authority SMALLINT CHECK(authority BETWEEN 0 AND 10),
  intelligence SMALLINT CHECK(intelligence BETWEEN 0 AND 10),
  discipline SMALLINT CHECK(discipline BETWEEN 0 AND 10),
  weighted_score NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_ratings_post ON ratings(post_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id);

-- RANK HISTORY
CREATE TABLE IF NOT EXISTS rank_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status_score NUMERIC(5,2),
  percentile_rank NUMERIC(5,2),
  rank INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEADERBOARD SNAPSHOTS
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope TEXT NOT NULL, -- global / college:{id} / city:{name}
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BATTLES
CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenger_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  opponent_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  entry_fee_cents INT DEFAULT 0,
  status TEXT DEFAULT 'OPEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BATTLE VOTES
CREATE TABLE IF NOT EXISTS battle_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
  voter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote_for UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(battle_id, voter_id)
);

-- REPORTS
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at);

-- MODERATION LOGS
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  decision moderation_decision NOT NULL,
  scores JSONB,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FLAGGED USERS
CREATE TABLE IF NOT EXISTS flagged_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FLAGGED POSTS
CREATE TABLE IF NOT EXISTS flagged_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RATING ANOMALY LOGS
CREATE TABLE IF NOT EXISTS rating_anomaly_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
