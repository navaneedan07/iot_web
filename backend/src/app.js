import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import { errorHandler } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'
import { userRouter } from './routes/users.js'
import { postRouter } from './routes/posts.js'
import { ratingRouter } from './routes/ratings.js'
import { leaderboardRouter } from './routes/leaderboard.js'
import { battleRouter } from './routes/battles.js'
import { adminRouter } from './routes/admin.js'
import { healthRouter } from './routes/health.js'
import { commentRouter } from './routes/comments.js'
import { analyticsRouter } from './routes/analytics.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const backendRoot = path.resolve(__dirname, '..')
const uploadDir = path.resolve(backendRoot, process.env.UPLOAD_DIR || './uploads')

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100
})

app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(limiter)
app.use(morgan('combined'))
app.use('/uploads', express.static(uploadDir))

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/ratings', ratingRouter)
app.use('/leaderboard', leaderboardRouter)
app.use('/battles', battleRouter)
app.use('/admin', adminRouter)
app.use('/comments', commentRouter)
app.use('/analytics', analyticsRouter)
app.use('/health', healthRouter)

app.use(errorHandler)

export default app
