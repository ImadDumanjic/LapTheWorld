import jwt from 'jsonwebtoken'
import User from '../../models/User.js'

const GOOGLE_TOKENINFO_URL = 'https://oauth2.googleapis.com/tokeninfo'

async function verifyGoogleIdToken(idToken) {
  const url = `${GOOGLE_TOKENINFO_URL}?id_token=${encodeURIComponent(idToken)}`
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    console.error('[Google Auth] tokeninfo error:', data)
    const err = new Error('Invalid Google token')
    err.status = 401
    throw err
  }

  const { sub, email, name, email_verified, aud, azp, exp } = data
  console.log('[Google Auth] tokeninfo ok — aud:', aud, 'azp:', azp)

  if (!sub || !email) {
    const err = new Error('Invalid Google token')
    err.status = 401
    throw err
  }

  const allowedClientIds = [process.env.GOOGLE_CLIENT_ID].filter(Boolean)
  const audience = aud || azp
  if (allowedClientIds.length > 0 && !allowedClientIds.includes(audience)) {
    console.error('[Google Auth] audience mismatch — got:', audience, 'expected one of:', allowedClientIds)
    const err = new Error('Invalid token audience')
    err.status = 401
    throw err
  }

  if (exp && Number(exp) * 1000 < Date.now()) {
    const err = new Error('Token expired')
    err.status = 401
    throw err
  }

  if (email_verified !== true && email_verified !== 'true') {
    const err = new Error('Email not verified')
    err.status = 403
    throw err
  }

  return { sub, email, name }
}

async function generateUsername(base) {
  const clean = base.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16) || 'user'
  let candidate = clean
  while (await User.findOne({ where: { username: candidate } })) {
    candidate = `${clean.slice(0, 12)}_${Math.floor(Math.random() * 9000) + 1000}`
  }
  return candidate
}

export async function googleLoginService(idToken) {
  const { sub, email, name } = await verifyGoogleIdToken(idToken)

  let user = await User.findOne({ where: { google_sub: sub } })

  if (!user) {
    user = await User.findOne({ where: { email } })
    if (user && user.auth_provider === 'password') {
      const err = new Error('An account with this email already exists. Please sign in with your password.')
      err.status = 409
      throw err
    }
  }

  if (!user) {
    const nameParts = (name || email.split('@')[0]).split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    const username = await generateUsername(email.split('@')[0])

    user = await User.create({
      email,
      username,
      firstName,
      lastName,
      auth_provider: 'google',
      google_sub: sub,
      role: 'User',
    })
  }

  if (user.banned) {
    const err = new Error('Your account has been banned. Please contact support.')
    err.status = 403
    throw err
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
      email: user.email,
      role: user.role,
    },
  }
}
