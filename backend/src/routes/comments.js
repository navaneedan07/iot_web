import express from 'express'
import Joi from 'joi'
import { authRequired } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'
import { listCommentsByPost, createComment } from '../services/commentService.js'

export const commentRouter = express.Router()

const createSchema = Joi.object({
  postId: Joi.string().uuid().required(),
  content: Joi.string().max(300).required()
})

commentRouter.get('/post/:postId', asyncHandler(async (req, res) => {
  const comments = await listCommentsByPost(req.params.postId)
  res.json(comments)
}))

commentRouter.post('/', authRequired, validate(createSchema), asyncHandler(async (req, res) => {
  const comment = await createComment({
    postId: req.validated.postId,
    userId: req.user.id,
    content: req.validated.content
  })
  res.status(201).json(comment)
}))
