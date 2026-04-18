import User from '../../models/User.js'
import { comparePassword, hashPassword } from '../utils/passwordHelper.js'
import { validatePassword } from '../utils/validators.js'

export async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'firstName', 'lastName', 'email', 'phone', 'role', 'createdAt', 'passwordChangedAt'],
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

export async function verifyPassword(req, res) {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { currentPassword } = req.body
    if (!currentPassword) return res.status(400).json({ message: 'Current password required' })

    const valid = await comparePassword(currentPassword, user.password)
    if (!valid) return res.status(401).json({ message: 'Incorrect password' })

    res.json({ valid: true })
  } catch (err) {
    console.error('verifyPassword error:', err)
    res.status(500).json({ message: err.message })
  }
}

export async function changePassword(req, res) {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords required' })
    }

    const valid = await comparePassword(currentPassword, user.password)
    if (!valid) return res.status(401).json({ message: 'Incorrect current password' })

    const errors = validatePassword(newPassword)
    if (errors.length) return res.status(400).json({ message: errors[0], errors })

    const sameAsOld = await comparePassword(newPassword, user.password)
    if (sameAsOld) {
      return res.status(400).json({ message: 'New password must differ from current password' })
    }

    const hashed = await hashPassword(newPassword)
    await user.update({
      password: hashed,
      passwordChangedAt: new Date(),
      passwordChangeCount: user.passwordChangeCount + 1,
    })

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('changePassword error:', err)
    res.status(500).json({ message: err.message })
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
