import express from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getLeaderboard } from '../services/leaderboardService.js'

export const leaderboardRouter = express.Router()

leaderboardRouter.get('/', asyncHandler(async (req, res) => {
  const { scope = 'global', limit = 20 } = req.query
  const data = await getLeaderboard({ scope, limit: Number(limit) })
  res.json(data)
}))
