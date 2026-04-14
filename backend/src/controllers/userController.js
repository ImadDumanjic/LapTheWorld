import User from '../../models/User.js'

export async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'phone', 'role'],
    })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error('getProfile error:', err)
    res.status(500).json({ message: err.message })
  }
}

export async function updateProfile(req, res) {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { firstName, lastName, email, phone } = req.body

    await user.update({ firstName, lastName, email, phone })

    res.json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    })
  } catch (err) {
    console.error('updateProfile error:', err)
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function deleteAccount(req, res) {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    await user.destroy()
    res.status(204).end()
  } catch (err) {
    console.error('deleteAccount error:', err)
    res.status(500).json({ message: err.message })
  }
}
