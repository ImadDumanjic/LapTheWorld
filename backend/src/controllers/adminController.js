import User from '../../models/User.js'
import Blog from '../../models/Blog.js'

const USER_SAFE_ATTRS = [
  'id', 'username', 'email', 'firstName', 'lastName', 'phone', 'role', 'createdAt', 'updatedAt',
]

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: USER_SAFE_ATTRS,
      order: [['createdAt', 'DESC']],
    })
    res.json(users)
  } catch (err) {
    console.error('getAllUsers error:', err)
    res.status(500).json({ message: err.message })
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.id === req.user.id) return res.status(400).json({ message: 'Cannot delete your own account' })
    await user.destroy()
    res.status(204).end()
  } catch (err) {
    console.error('deleteUser error:', err)
    res.status(500).json({ message: err.message })
  }
}

export async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.findAll({
      include: [{ model: User, as: 'author', attributes: ['username', 'email'] }],
      order: [['created_at', 'DESC']],
    })
    res.json(blogs)
  } catch (err) {
    console.error('getAllBlogs error:', err)
    res.status(500).json({ message: err.message })
  }
}

export async function updateBlogStatus(req, res) {
  try {
    const { status } = req.body
    const allowed = ['draft', 'pending', 'approved', 'rejected', 'deleted']
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const blog = await Blog.findByPk(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })

    blog.status = status
    if (status === 'approved') {
      blog.approved_at = new Date()
      blog.approved_by = req.user.id
    }
    if (status === 'deleted') {
      blog.deleted_at = new Date()
      blog.deleted_by = req.user.id
    }

    await blog.save()
    res.json(blog)
  } catch (err) {
    console.error('updateBlogStatus error:', err)
    res.status(500).json({ message: err.message })
  }
}
