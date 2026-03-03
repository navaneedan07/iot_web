import express from 'express'
import Joi from 'joi'
import { authRequired } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createBattle, voteBattle, listBattles, autoMatchBattle } from '../services/battleService.js'

export const battleRouter = express.Router()

const createSchema = Joi.object({
  opponentId: Joi.string().uuid().required(),
  challengerPostId: Joi.string().uuid().required(),
  opponentPostId: Joi.string().uuid().required(),
  entryFeeCents: Joi.number().integer().min(0).default(0)
})

const voteSchema = Joi.object({
  battleId: Joi.string().uuid().required(),
  voteFor: Joi.string().uuid().required()
})

battleRouter.get('/', asyncHandler(async (req, res) => {
  const battles = await listBattles()
  res.json(battles)
}))

battleRouter.post('/', authRequired, validate(createSchema), asyncHandler(async (req, res) => {
  const battle = await createBattle({ challengerId: req.user.id, ...req.validated })
  res.status(201).json(battle)
}))

battleRouter.post('/auto-match', authRequired, asyncHandler(async (req, res) => {
  const battle = await autoMatchBattle(req.user.id)
  if (!battle) return res.status(404).json({ message: 'No matchable posts found — need at least 2 un-battled posts in the same category from different users.' })
  res.status(201).json(battle)
}))

battleRouter.post('/vote', authRequired, validate(voteSchema), asyncHandler(async (req, res) => {
  await voteBattle({ ...req.validated, voterId: req.user.id })
  res.status(201).json({ ok: true })
}))
