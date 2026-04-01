import crypto from 'crypto'
import User from '../../models/User.js'
import { hashPassword } from '../utils/passwordHelper.js'
import { validatePassword } from '../utils/validators.js'
import { sendPasswordResetEmail } from './emailService.js'

const RESET_TOKEN_EXPIRES_MS = 15 * 60 * 1000 

function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  return { rawToken, tokenHash }
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ where: { email } })

  if (!user) return

  const { rawToken, tokenHash } = generateResetToken()
  const expires = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS)

  await user.update({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpires: expires,
  })

  await sendPasswordResetEmail(email, rawToken)
}


export async function resetPassword(rawToken, newPassword) {
  const passwordErrors = validatePassword(newPassword)
  if (passwordErrors.length) {
    const err = new Error('Password does not meet requirements')
    err.status = 400
    err.errors = passwordErrors
    throw err
  }

  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  const user = await User.findOne({ where: { resetPasswordTokenHash: tokenHash } })

  if (!user) {
    const err = new Error('Invalid or expired reset link')
    err.status = 400
    throw err
  }

  if (!user.resetPasswordExpires || user.resetPasswordExpires <= new Date()) {
    await user.update({ resetPasswordTokenHash: null, resetPasswordExpires: null })
    const err = new Error('Reset link has expired')
    err.status = 410
    throw err
  }

  const hashedPassword = await hashPassword(newPassword)

  await user.update({
    password: hashedPassword,
    resetPasswordTokenHash: null,
    resetPasswordExpires: null,
    failedLoginAttempts: 0,
    lockUntil: null,
  })
}
