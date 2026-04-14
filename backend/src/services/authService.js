import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import { hashPassword, comparePassword } from '../utils/passwordHelper.js'

export async function register({ username, email, password, firstName, lastName, phone }) {
  const existingByUsername = await User.findOne({ where: { username } })
  const existingByEmail = await User.findOne({ where: { email } })

  if (existingByUsername || existingByEmail) {
    throw new Error('Username or email is already in use')
  }

  const hashedPassword = await hashPassword(password)

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phone: phone || null,
    role: 'User'
  })

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  }
}

const MAX_FAILED_ATTEMPTS = parseInt(process.env.MAX_FAILED_ATTEMPTS, 10);
const LOCK_DURATION_MS = parseInt(process.env.LOCK_DURATION_MS, 10);

export async function login({ email, password }) {
  const user = await User.findOne({ where: { email } })

  if (!user) {
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  const now = new Date()

  if (user.lockUntil && user.lockUntil > now) {
    const err = new Error('Too many failed login attempts. Please wait 15 minutes before trying again.')
    err.status = 429
    throw err
  }

  if (user.lockUntil && user.lockUntil <= now) {
    await user.update({ failedLoginAttempts: 0, lockUntil: null })
  }

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    const attempts = (user.lockUntil && user.lockUntil <= now ? 0 : user.failedLoginAttempts) + 1

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      await user.update({
        failedLoginAttempts: attempts,
        lockUntil: new Date(Date.now() + LOCK_DURATION_MS),
      })
      const err = new Error('Too many failed login attempts. Please wait 15 minutes before trying again.')
      err.status = 429
      throw err
    }

    await user.update({ failedLoginAttempts: attempts })
    const err = new Error('Invalid credentials')
    err.status = 401
    throw err
  }

  await user.update({ failedLoginAttempts: 0, lockUntil: null })

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  }
}