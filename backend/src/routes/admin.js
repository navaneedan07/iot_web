import express from 'express'
import { adminOnly, authRequired } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import pool from '../db/pool.js'

export const adminRouter = express.Router()

adminRouter.use(authRequired, adminOnly)

adminRouter.delete('/posts/:id', asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM posts WHERE id=$1', [req.params.id])
  res.json({ ok: true })
}))

adminRouter.post('/users/:id/ban', asyncHandler(async (req, res) => {
  await pool.query("UPDATE users SET role = 'USER', status_score = 0 WHERE id=$1", [req.params.id])
  await pool.query('INSERT INTO flagged_users (user_id, reason) VALUES ($1,$2)', [req.params.id, req.body.reason || 'admin_ban'])
  res.json({ ok: true })
}))

adminRouter.get('/flagged', asyncHandler(async (req, res) => {
  const posts = await pool.query('SELECT * FROM flagged_posts ORDER BY created_at DESC')
  const users = await pool.query('SELECT * FROM flagged_users ORDER BY created_at DESC')
  res.json({ posts: posts.rows, users: users.rows })
}))
