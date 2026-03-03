import pool from '../db/pool.js'
import { sendToModeration } from './moderationService.js'

const POST_LIMIT_PER_WEEK = 3

export async function canUserPost (userId) {
  const res = await pool.query(
    'SELECT COUNT(*)::int as count FROM posts WHERE user_id=$1 AND created_at > NOW() - INTERVAL \'7 days\'',
    [userId]
  )
  return res.rows[0].count < POST_LIMIT_PER_WEEK
}

export async function createPost ({ userId, mediaUrl, mediaType, category, caption }) {
  const allowed = await canUserPost(userId)
  if (!allowed) {
    const err = new Error('Weekly post limit reached')
    err.status = 400
    throw err
  }
  const moderation = await sendToModeration({ mediaUrl, mediaType, caption })
  const res = await pool.query(
    `INSERT INTO posts (user_id, media_url, media_type, category, caption, moderation_status, moderation_reason)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [userId, mediaUrl, mediaType, category, caption, moderation.action, moderation.reason || null]
  )
  await pool.query(
    'INSERT INTO moderation_logs (post_id, decision, scores, source) VALUES ($1,$2,$3,$4)',
    [res.rows[0].id, moderation.action, moderation.scores || {}, moderation.source || 'gemini']
  )
  return res.rows[0]
}

export async function listFeed ({ limit = 20, offset = 0 }) {
  const res = await pool.query(
    `SELECT p.*, u.username, u.profile_image
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.moderation_status='SAFE'
     ORDER BY p.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  )
  return res.rows
}

export async function getPost (postId) {
  const res = await pool.query('SELECT * FROM posts WHERE id=$1', [postId])
  return res.rows[0]
}

export async function deletePost (postId, userId) {
  const res = await pool.query('SELECT user_id FROM posts WHERE id=$1', [postId])
  if (!res.rows.length) {
    const err = new Error('Post not found')
    err.status = 404
    throw err
  }
  if (res.rows[0].user_id !== userId) {
    const err = new Error('You can only delete your own posts')
    err.status = 403
    throw err
  }
  await pool.query('DELETE FROM posts WHERE id=$1', [postId])
  return { ok: true }
}

export async function reportPost (postId, reporterId, reason) {
  await pool.query('INSERT INTO reports (post_id, reporter_id, reason) VALUES ($1,$2,$3)', [postId, reporterId, reason])
  return { ok: true }
}
