import User from '../../models/User.js'

export async function requireAdmin(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['role'] })
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    next()
  } catch {
    return res.status(500).json({ message: 'Server error' })
  }
}
