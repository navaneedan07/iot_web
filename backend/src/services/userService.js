import pool from '../db/pool.js'

export async function getUserProfile (userId) {
  const res = await pool.query(
    'SELECT id, email, name, username, bio, college, city, profile_image, status_score, percentile_rank, premium FROM users WHERE id=$1',
    [userId]
  )
  const user = res.rows[0]
  if (!user) return null

  // Compute live stats
  const [postsWeek, avgScore, ratingsReceived] = await Promise.all([
    pool.query(
      "SELECT COUNT(*)::int AS c FROM posts WHERE user_id=$1 AND created_at > NOW() - INTERVAL '7 days'",
      [userId]
    ),
    pool.query(
      'SELECT ROUND(AVG(score)::numeric, 2) AS avg FROM posts WHERE user_id=$1 AND score IS NOT NULL AND score > 0',
      [userId]
    ),
    pool.query(
      'SELECT COUNT(*)::int AS c FROM ratings r JOIN posts p ON p.id = r.post_id WHERE p.user_id=$1',
      [userId]
    )
  ])

  user.posts_this_week = postsWeek.rows[0].c
  user.avg_score = avgScore.rows[0].avg != null ? Number(avgScore.rows[0].avg) : null
  user.ratings_received = ratingsReceived.rows[0].c
  return user
}

export async function updateUserProfile (userId, payload) {
  const fields = ['name', 'bio', 'college', 'city', 'profile_image', 'premium']
  const updates = []
  const values = []
  fields.forEach((field, idx) => {
    if (payload[field] !== undefined) {
      updates.push(`${field}=$${values.length + 1}`)
      values.push(payload[field])
    }
  })
  if (!updates.length) return getUserProfile(userId)
  values.push(userId)
  await pool.query(`UPDATE users SET ${updates.join(', ')}, updated_at=NOW() WHERE id=$${values.length}`, values)
  return getUserProfile(userId)
}

export async function deleteAccount (userId) {
  // CASCADE will remove posts, ratings, battle_votes, comments, rank_history, etc.
  const res = await pool.query('DELETE FROM users WHERE id=$1 RETURNING id', [userId])
  if (!res.rows.length) {
    const err = new Error('Account not found')
    err.status = 404
    throw err
  }
  return { deleted: true }
}

export async function getRankHistory (userId, limit = 20) {
  const res = await pool.query('SELECT * FROM rank_history WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2', [userId, limit])
  return res.rows
}
