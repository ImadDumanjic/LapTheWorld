import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import User from '../../models/User.js'
import { comparePassword } from '../utils/passwordHelper.js'

const MAX_FAILED_ATTEMPTS = parseInt(process.env.MAX_FAILED_ATTEMPTS, 10)
const LOCK_DURATION_MS    = parseInt(process.env.LOCK_DURATION_MS, 10)

// Step 1 — validate email + password, return a short-lived temp token
export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    // Return the same error whether the user doesn't exist or isn't an admin
    if (!user || user.role !== 'Admin') {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const now = new Date()
    if (user.lockUntil && user.lockUntil > now) {
      return res.status(429).json({ message: 'Account locked. Please try again later.' })
    }
    if (user.lockUntil && user.lockUntil <= now) {
      await user.update({ failedLoginAttempts: 0, lockUntil: null })
    }

    const isValid = await comparePassword(password, user.password)
    if (!isValid) {
      const attempts = (user.failedLoginAttempts || 0) + 1
      if (attempts >= MAX_FAILED_ATTEMPTS) {
        await user.update({ failedLoginAttempts: attempts, lockUntil: new Date(Date.now() + LOCK_DURATION_MS) })
        return res.status(429).json({ message: 'Too many failed attempts. Account locked.' })
      }
      await user.update({ failedLoginAttempts: attempts })
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    await user.update({ failedLoginAttempts: 0, lockUntil: null })

    if (user.banned) {
      return res.status(403).json({ message: 'This account has been banned.' })
    }

    // First-time setup — generate a TOTP secret and return a QR code
    if (!user.totpSecret) {
      const secret     = speakeasy.generateSecret({ name: 'LapTheWorld Admin', issuer: 'LapTheWorld' })
      const qrDataUrl  = await QRCode.toDataURL(secret.otpauth_url)
      const tempToken  = jwt.sign(
        { id: user.id, phase: 'totp-setup', pendingSecret: secret.base32 },
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      )
      return res.json({ requiresSetup: true, tempToken, qrDataUrl, manualSecret: secret.base32 })
    }

    // TOTP already configured — issue a short-lived pending token
    const tempToken = jwt.sign(
      { id: user.id, phase: 'totp-pending' },
      process.env.JWT_SECRET,
      { expiresIn: '5m' }
    )
    res.json({ requiresTotp: true, tempToken })
  } catch (err) {
    console.error('adminLogin error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Step 2a — verify TOTP code against stored secret → issue full JWT
export async function adminVerifyTotp(req, res) {
  try {
    const { tempToken, totpCode } = req.body

    let payload
    try {
      payload = jwt.verify(tempToken, process.env.JWT_SECRET)
    } catch {
      return res.status(401).json({ message: 'Session expired. Please log in again.' })
    }

    if (payload.phase !== 'totp-pending') {
      return res.status(401).json({ message: 'Invalid session state' })
    }

    const user = await User.findByPk(payload.id)
    if (!user || user.role !== 'Admin' || !user.totpSecret) {
      return res.status(401).json({ message: 'Invalid session' })
    }

    const isValid = speakeasy.totp.verify({
      secret:   user.totpSecret,
      encoding: 'base32',
      token:    totpCode.replace(/\s/g, ''),
      window:   1,
    })

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid authentication code' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    res.json({ token })
  } catch (err) {
    console.error('adminVerifyTotp error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Step 2b — confirm first-time setup, save secret, issue full JWT
export async function adminConfirmTotpSetup(req, res) {
  try {
    const { tempToken, totpCode } = req.body

    let payload
    try {
      payload = jwt.verify(tempToken, process.env.JWT_SECRET)
    } catch {
      return res.status(401).json({ message: 'Session expired. Please log in again.' })
    }

    if (payload.phase !== 'totp-setup' || !payload.pendingSecret) {
      return res.status(401).json({ message: 'Invalid session state' })
    }

    const user = await User.findByPk(payload.id)
    if (!user || user.role !== 'Admin') {
      return res.status(401).json({ message: 'Invalid session' })
    }

    const isValid = speakeasy.totp.verify({
      secret:   payload.pendingSecret,
      encoding: 'base32',
      token:    totpCode.replace(/\s/g, ''),
      window:   1,
    })

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid code. Make sure your authenticator is synced.' })
    }

    await user.update({ totpSecret: payload.pendingSecret })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    res.json({ token })
  } catch (err) {
    console.error('adminConfirmTotpSetup error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
