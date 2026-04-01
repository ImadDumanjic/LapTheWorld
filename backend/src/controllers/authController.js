import { register, login } from '../services/authService.js'
import { requestPasswordReset, resetPassword } from '../services/passwordResetService.js'

export async function registerUser(req, res) {
  try {
    const result = await register(req.body)
    res.status(201).json(result)
  } catch (err) {
    console.error('registerUser error:', err)
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function loginUser(req, res) {
  try {
    const result = await login(req.body)
    res.json(result)
  } catch (err) {
    console.error('loginUser error:', err)
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function requestPasswordResetHandler(req, res) {
  try {
    const { email } = req.body
    await requestPasswordReset(email)
    res.json({ message: "If that email is registered, we've sent a reset link." })
  } catch (err) {
    console.error('requestPasswordReset error:', err)
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function resetPasswordHandler(req, res) {
  try {
    const { token, newPassword } = req.body
    await resetPassword(token, newPassword)
    res.json({ message: 'Password reset successfully. You can now log in.' })
  } catch (err) {
    console.error('resetPassword error:', err)
    res.status(err.status || 500).json({ message: err.message, errors: err.errors })
  }
}
