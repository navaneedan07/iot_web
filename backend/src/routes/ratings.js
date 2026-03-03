import express from 'express'
import Joi from 'joi'
import { authRequired } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ratePost } from '../services/ratingService.js'

export const ratingRouter = express.Router()

const ratingSchema = Joi.object({
  postId: Joi.string().uuid().required(),
  presence: Joi.number().integer().min(0).max(10).required(),
  aesthetic: Joi.number().integer().min(0).max(10).required(),
  authority: Joi.number().integer().min(0).max(10).required(),
  intelligence: Joi.number().integer().min(0).max(10).required(),
  discipline: Joi.number().integer().min(0).max(10).required()
})

ratingRouter.post('/', authRequired, validate(ratingSchema), asyncHandler(async (req, res) => {
  const result = await ratePost({ ...req.validated, userId: req.user.id })
  res.status(201).json(result)
}))
