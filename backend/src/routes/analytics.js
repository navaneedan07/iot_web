import express from 'express'
import { authRequired } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getScoreTrend,
  getCategoryBreakdown,
  getDimensionStrengths,
  getOverviewStats,
  getRecentActivity
} from '../services/analyticsService.js'

export const analyticsRouter = express.Router()

analyticsRouter.get('/', authRequired, asyncHandler(async (req, res) => {
  const userId = req.user.id
  const days = Number(req.query.days) || 30

  const [overview, scoreTrend, categories, dimensions, activity] = await Promise.all([
    getOverviewStats(userId),
    getScoreTrend(userId, days),
    getCategoryBreakdown(userId),
    getDimensionStrengths(userId),
    getRecentActivity(userId, 15)
  ])

  res.json({ overview, scoreTrend, categories, dimensions, activity })
}))
