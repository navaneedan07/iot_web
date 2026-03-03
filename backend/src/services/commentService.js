import pool from '../db/pool.js'

export async function listCommentsByPost (postId, limit = 50) {
  const res = await pool.query(
    `SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.username
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id=$1
     ORDER BY c.created_at ASC
     LIMIT $2`,
    [postId, limit]
  )
  return res.rows
}

export async function createComment ({ postId, userId, content }) {
  const trimmed = content.trim()
  if (!trimmed) {
    const err = new Error('Comment cannot be empty')
    err.status = 400
    throw err
  }

  const postExists = await pool.query('SELECT id FROM posts WHERE id=$1', [postId])
  if (!postExists.rows.length) {
    const err = new Error('Post not found')
    err.status = 404
    throw err
  }

  const res = await pool.query(
    `INSERT INTO comments (post_id, user_id, content)
     VALUES ($1,$2,$3)
     RETURNING id, post_id, user_id, content, created_at`,
    [postId, userId, trimmed]
  )

  const comment = res.rows[0]
  const userRes = await pool.query('SELECT username FROM users WHERE id=$1', [userId])
  return { ...comment, username: userRes.rows[0]?.username || 'user' }
}
