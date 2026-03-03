import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

let pool

async function run () {
  const poolModule = await import('./pool.js')
  pool = poolModule.default

  const schemaCheck = await pool.query("SELECT to_regclass('public.users') AS users_table")
  if (!schemaCheck.rows[0]?.users_table) {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
    await pool.query(schemaSql)
  }

  const passwordHash = await bcrypt.hash('password123', 10)
  const userRes = await pool.query(
    `INSERT INTO users (email, password_hash, name, username, bio, college, city, premium, role)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
     RETURNING id`,
    ['demo@scoreme.app', passwordHash, 'Demo User', 'demo', 'Demo bio', 'State College', 'Metropolis', true, 'ADMIN']
  )
  const userId = userRes.rows[0].id

  await pool.query(
    `INSERT INTO posts (user_id, media_url, media_type, category, caption, score, ratings_count, moderation_status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT DO NOTHING`,
    [userId, '/uploads/demo.jpg', 'image/jpeg', 'OUTFIT', 'First fit check', 82.5, 10, 'SAFE']
  )

  console.log('Seed complete')
  await pool.end()
}

run().catch(async (err) => {
  console.error(err)
  if (pool) await pool.end()
  process.exit(1)
})
