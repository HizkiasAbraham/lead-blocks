import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getDb } from '../db'

export interface JwtPayload {
  id: number
  email: string
  full_name: string
}

const db = getDb()

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.warn('[auth] JWT_SECRET is not set, using a default dev secret. Do NOT use this in production.')
    return 'dev-secret-change-me'
  }
  return secret
}

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const user = db
    .prepare('SELECT id, email, full_name, password FROM users WHERE email = ?')
    .get(email) as { id: number; email: string; full_name: string; password: string } | undefined

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
  }

  const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '1h' })

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    },
  })
}

