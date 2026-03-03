import pool from '../db/pool.js'

const weights = { presence: 0.2, aesthetic: 0.2, authority: 0.2, intelligence: 0.2, discipline: 0.2 }

function computeWeightedScore (scores) {
  const total = Object.entries(weights).reduce((acc, [key, w]) => acc + (scores[key] * w), 0)
  return Math.round(total * 10) / 10
}

export async function ratePost ({ postId, userId, presence, aesthetic, authority, intelligence, discipline }) {
  const postRes = await pool.query('SELECT user_id FROM posts WHERE id=$1', [postId])
  if (!postRes.rows.length) {
    const err = new Error('Post not found')
    err.status = 404
    throw err
  }
  if (postRes.rows[0].user_id === userId) {
    const err = new Error('Cannot rate your own post')
    err.status = 400
    throw err
  }
  const scores = { presence, aesthetic, authority, intelligence, discipline }
  const weightedScore = computeWeightedScore(scores)
  await pool.query(
    `INSERT INTO ratings (post_id, user_id, presence, aesthetic, authority, intelligence, discipline, weighted_score)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [postId, userId, presence, aesthetic, authority, intelligence, discipline, weightedScore]
  )
  await updatePostAggregate(postId)
  return { weightedScore }
}

async function updatePostAggregate (postId) {
  const res = await pool.query('SELECT AVG(weighted_score) AS avg_score, COUNT(*)::int AS count FROM ratings WHERE post_id=$1', [postId])
  const { avg_score: avgScore, count } = res.rows[0]
  await pool.query('UPDATE posts SET score=$1, ratings_count=$2 WHERE id=$3', [avgScore, count, postId])
  await updateUserStatusScore(postId)
}

async function updateUserStatusScore (postId) {
  const postRes = await pool.query('SELECT user_id FROM posts WHERE id=$1', [postId])
  const userId = postRes.rows[0].user_id
  const recent = await pool.query(
    `SELECT score, created_at FROM posts
     WHERE user_id=$1 AND score IS NOT NULL
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId]
  )
  let numerator = 0
  let denom = 0
  recent.rows.forEach((row, idx) => {
    const decay = 1 - idx * 0.1
    numerator += Number(row.score) * decay
    denom += decay
  })
  const statusScore = denom ? Math.min(100, Math.round((numerator / denom) * 10) / 10) : 0
  await pool.query('UPDATE users SET status_score=$1 WHERE id=$2', [statusScore, userId])

  // Compute percentile rank among all scored users
  const allScores = await pool.query(
    'SELECT id, status_score FROM users WHERE status_score > 0 ORDER BY status_score ASC'
  )
  const total = allScores.rows.length
  let percentile = 0
  if (total > 0) {
    const rank = allScores.rows.findIndex(r => r.id === userId)
    percentile = total === 1 ? 100 : Math.round((rank / (total - 1)) * 10000) / 100
  }
  await pool.query('UPDATE users SET percentile_rank=$1 WHERE id=$2', [percentile, userId])

  await pool.query(
    'INSERT INTO rank_history (user_id, status_score, percentile_rank, rank) VALUES ($1,$2,$3,$4)',
    [userId, statusScore, percentile, total > 0 ? total - allScores.rows.findIndex(r => r.id === userId) : 0]
  )
}
