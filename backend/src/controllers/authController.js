import { register, login } from '../services/authService.js'

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
