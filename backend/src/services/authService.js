import jwt from 'jsonwebtoken'
import User from '../../models/User.js'
import { hashPassword, comparePassword } from '../utils/passwordHelper.js'

export async function register({ username, email, password, firstName, lastName }) {
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
    lastName
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
      email: user.email
    }
  }
}

export async function login({ email, password }) {
  const user = await User.findOne({ where: { email } })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    throw new Error('Invalid credentials')
  }

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
      email: user.email
    }
  }
}