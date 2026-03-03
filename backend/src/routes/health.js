import express from 'express'
import pool from '../db/pool.js'

export const healthRouter = express.Router()

healthRouter.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ ok: false })
  }
})
