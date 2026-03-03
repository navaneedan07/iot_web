import pool from '../db/pool.js'

/* ── Score trend (last N rank_history entries) ── */
export async function getScoreTrend (userId, days = 30) {
  const res = await pool.query(
    `SELECT status_score, created_at
     FROM rank_history
     WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '1 day' * $2
     ORDER BY created_at ASC`,
    [userId, days]
  )
  return res.rows.map(r => ({
    score: Number(r.status_score),
    date: r.created_at
  }))
}

/* ── Category breakdown: avg score per category ── */
export async function getCategoryBreakdown (userId) {
  const res = await pool.query(
    `SELECT p.category,
            ROUND(AVG(p.score), 1) AS avg_score,
            COUNT(*)::int AS total_posts,
            SUM(p.ratings_count)::int AS total_ratings
     FROM posts p
     WHERE p.user_id = $1 AND p.score IS NOT NULL AND p.score > 0
     GROUP BY p.category
     ORDER BY avg_score DESC`,
    [userId]
  )
  return res.rows.map(r => ({
    category: r.category,
    avgScore: Number(r.avg_score),
    totalPosts: r.total_posts,
    totalRatings: r.total_ratings
  }))
}

/* ── Dimension strengths: avg of each dimension across all ratings received ── */
export async function getDimensionStrengths (userId) {
  const res = await pool.query(
    `SELECT
       ROUND(AVG(r.presence), 1)     AS presence,
       ROUND(AVG(r.aesthetic), 1)    AS aesthetic,
       ROUND(AVG(r.authority), 1)    AS authority,
       ROUND(AVG(r.intelligence), 1) AS intelligence,
       ROUND(AVG(r.discipline), 1)   AS discipline,
       COUNT(*)::int                 AS total_ratings
     FROM ratings r
     JOIN posts p ON r.post_id = p.id
     WHERE p.user_id = $1`,
    [userId]
  )
  const row = res.rows[0]
  if (!row || !row.total_ratings) return null
  return {
    presence: Number(row.presence),
    aesthetic: Number(row.aesthetic),
    authority: Number(row.authority),
    intelligence: Number(row.intelligence),
    discipline: Number(row.discipline),
    totalRatings: row.total_ratings
  }
}

/* ── Overview stats ── */
export async function getOverviewStats (userId) {
  const [postRes, ratingRes, commentRes, userRes] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS total_posts,
              SUM(ratings_count)::int AS total_ratings_received,
              ROUND(AVG(score), 1) AS avg_post_score
       FROM posts WHERE user_id = $1`,
      [userId]
    ),
    pool.query(
      'SELECT COUNT(*)::int AS ratings_given FROM ratings WHERE user_id = $1',
      [userId]
    ),
    pool.query(
      'SELECT COUNT(*)::int AS comments_given FROM comments WHERE user_id = $1',
      [userId]
    ),
    pool.query(
      'SELECT status_score, percentile_rank FROM users WHERE id = $1',
      [userId]
    )
  ])

  const p = postRes.rows[0]
  const r = ratingRes.rows[0]
  const c = commentRes.rows[0]
  const u = userRes.rows[0]

  return {
    totalPosts: p.total_posts || 0,
    totalRatingsReceived: p.total_ratings_received || 0,
    avgPostScore: p.avg_post_score ? Number(p.avg_post_score) : 0,
    ratingsGiven: r.ratings_given || 0,
    commentsGiven: c.comments_given || 0,
    statusScore: u ? Number(u.status_score) : 0,
    percentileRank: u ? Number(u.percentile_rank) : 0
  }
}

/* ── Recent activity on user's posts ── */
export async function getRecentActivity (userId, limit = 10) {
  const res = await pool.query(
    `(SELECT 'rating' AS type, r.weighted_score AS value, r.created_at,
             u.username, p.category
      FROM ratings r
      JOIN posts p ON r.post_id = p.id
      JOIN users u ON r.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY r.created_at DESC LIMIT $2)
     UNION ALL
     (SELECT 'comment' AS type, NULL AS value, c.created_at,
             u.username, p.category
      FROM comments c
      JOIN posts p ON c.post_id = p.id
      JOIN users u ON c.user_id = u.id
      WHERE p.user_id = $1
      ORDER BY c.created_at DESC LIMIT $2)
     ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  )
  return res.rows
}
