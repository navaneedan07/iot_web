import express from 'express'
import Joi from 'joi'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { authRequired } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { createPost, listFeed, getPost, deletePost, reportPost } from '../services/postService.js'

export const postRouter = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const backendRoot = path.resolve(__dirname, '../..')
const uploadDir = path.resolve(backendRoot, process.env.UPLOAD_DIR || './uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image') && !file.mimetype.startsWith('video')) {
      return cb(new Error('Invalid file type'))
    }
    cb(null, true)
  }
})

const postSchema = Joi.object({
  category: Joi.string().min(2).max(100).required(),
  caption: Joi.string().allow('', null)
})

postRouter.get('/', asyncHandler(async (req, res) => {
  const posts = await listFeed({})
  res.json(posts)
}))

postRouter.get('/:id', asyncHandler(async (req, res) => {
  const post = await getPost(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })
  res.json(post)
}))

postRouter.post('/', authRequired, upload.single('media'), validate(postSchema), asyncHandler(async (req, res) => {
  const mediaUrl = `/uploads/${req.file.filename}`
  const post = await createPost({
    userId: req.user.id,
    mediaUrl,
    mediaType: req.file.mimetype,
    category: req.validated.category,
    caption: req.validated.caption || ''
  })
  res.status(201).json(post)
}))

postRouter.delete('/:id', authRequired, asyncHandler(async (req, res) => {
  await deletePost(req.params.id, req.user.id)
  res.json({ ok: true })
}))

postRouter.post('/:id/report', authRequired, asyncHandler(async (req, res) => {
  await reportPost(req.params.id, req.user.id, req.body.reason || 'unspecified')
  res.json({ ok: true })
}))
