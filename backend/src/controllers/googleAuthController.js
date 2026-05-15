import { googleLoginService } from '../services/googleAuthService.js'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
}

export async function googleLoginController(req, res) {
  try {
    const idToken =
      req.body.idToken ??
      req.body.id_token ??
      req.body.credential ??
      req.body.token

    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' })
    }

    const result = await googleLoginService(idToken)
    res.cookie('token', result.token, COOKIE_OPTIONS)
    res.json({ user: result.user })
  } catch (err) {
    console.error('googleLogin error:', err)
    res.status(err.status || 500).json({ message: err.status ? err.message : 'Something went wrong. Please try again.' })
  }
}
