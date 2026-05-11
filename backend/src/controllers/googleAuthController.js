import { googleLoginService } from '../services/googleAuthService.js'

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
    res.json(result)
  } catch (err) {
    console.error('googleLogin error:', err)
    res.status(err.status || 500).json({ message: err.message })
  }
}
