import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db/pool.js'

export async function registerUser ({ email, password, name, username, college, city }) {
  const existing = await pool.query('SELECT id FROM users WHERE email=$1 OR username=$2', [email, username])
  if (existing.rows.length) {
    const err = new Error('Email or username already exists')
    err.status = 400
    throw err
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const res = await pool.query(
    `INSERT INTO users (email, password_hash, name, username, college, city)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, email, name, username, role, college, city`,
    [email, passwordHash, name, username, college || null, city || null]
  )
  const user = res.rows[0]
  return { user, token: signToken(user) }
}

export async function loginUser ({ email, password }) {
  const res = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  if (!res.rows.length) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }
  const user = res.rows[0]
  const match = await bcrypt.compare(password, user.password_hash)
  if (!match) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }
  return { user, token: signToken(user) }
}

function signToken (user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}
