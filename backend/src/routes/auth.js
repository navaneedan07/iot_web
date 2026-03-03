import express from 'express'
import Joi from 'joi'
import { registerUser, loginUser } from '../services/authService.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validate } from '../middleware/validate.js'

export const authRouter = express.Router()

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).required(),
  username: Joi.string().alphanum().min(3).required(),
  college: Joi.string().max(100).allow('', null),
  city: Joi.string().max(100).allow('', null)
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

authRouter.post('/register', validate(registerSchema), asyncHandler(async (req, res) => {
  const { user, token } = await registerUser(req.validated)
  res.status(201).json({ user, token })
}))

authRouter.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const { user, token } = await loginUser(req.validated)
  res.json({ user, token })
}))
