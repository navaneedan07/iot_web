import express from 'express'
import Joi from 'joi'
import { authRequired } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { getUserProfile, updateUserProfile, getRankHistory, deleteAccount } from '../services/userService.js'

export const userRouter = express.Router()

const updateSchema = Joi.object({
  name: Joi.string().min(2),
  bio: Joi.string().max(200),
  college: Joi.string().max(100),
  city: Joi.string().max(100),
  profile_image: Joi.string(),
  premium: Joi.boolean()
})

userRouter.get('/me', authRequired, asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.id)
  res.json(user)
}))

userRouter.put('/me', authRequired, validate(updateSchema), asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user.id, req.validated)
  res.json(user)
}))

userRouter.get('/me/rank-history', authRequired, asyncHandler(async (req, res) => {
  const history = await getRankHistory(req.user.id)
  res.json(history)
}))

userRouter.delete('/me', authRequired, asyncHandler(async (req, res) => {
  const result = await deleteAccount(req.user.id)
  res.json(result)
}))
