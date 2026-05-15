import { register, login } from '../services/authService.js'
import { requestPasswordReset, resetPassword } from '../services/passwordResetService.js'

const safeMessage = (err) =>
  err.status ? err.message : 'Something went wrong. Please try again.'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT_EXPIRES_IN)
  path: '/',
}

function setAuthCookie(res, token) {
  res.cookie('token', token, COOKIE_OPTIONS)
}

export async function registerUser(req, res) {
  try {
    const result = await register(req.body)
    setAuthCookie(res, result.token)
    res.status(201).json({ user: result.user })
  } catch (err) {
    console.error('registerUser error:', err)
    res.status(err.status || 500).json({ message: safeMessage(err) })
  }
}

export async function loginUser(req, res) {
  try {
    const result = await login(req.body)
    setAuthCookie(res, result.token)
    res.json({ user: result.user })
  } catch (err) {
    console.error('loginUser error:', err)
    res.status(err.status || 500).json({ message: safeMessage(err) })
  }
}

export async function logoutUser(req, res) {
  res.clearCookie('token', { path: '/' })
  res.json({ message: 'Logged out' })
}

export async function requestPasswordResetHandler(req, res) {
  try {
    const { email } = req.body
    await requestPasswordReset(email)
    res.json({ message: "If that email is registered, we've sent a reset link." })
  } catch (err) {
    console.error('requestPasswordReset error:', err)
    res.status(err.status || 500).json({ message: safeMessage(err) })
  }
}

export async function resetPasswordHandler(req, res) {
  try {
    const { token, newPassword } = req.body
    await resetPassword(token, newPassword)
    res.json({ message: 'Password reset successfully. You can now log in.' })
  } catch (err) {
    console.error('resetPassword error:', err)
    res.status(err.status || 500).json({ message: safeMessage(err), errors: err.errors })
  }
}
