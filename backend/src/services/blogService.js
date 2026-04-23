import { Op } from 'sequelize'
import Blog from '../../models/Blog.js'
import User from '../../models/User.js'

const PAGE_SIZE = 5

export async function createBlog({ title, content, image_url, author_id }) {
  return Blog.create({ title, content, image_url, author_id, status: 'pending' })
}

export async function getBlogs({ page = 1 } = {}) {
  const limit  = PAGE_SIZE
  const offset = (page - 1) * limit

  const { count, rows } = await Blog.findAndCountAll({
    where: { status: 'approved' },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['username', 'firstName', 'lastName'],
      },
    ],
    order: [['created_at', 'ASC']],
    limit,
    offset,
  })

  return {
    blogs:      rows,
    total:      count,
    page,
    totalPages: Math.ceil(count / limit),
  }
}

export async function getUserBlogs({ userId, page = 1 } = {}) {
  const limit  = PAGE_SIZE
  const offset = (page - 1) * limit

  const { count, rows } = await Blog.findAndCountAll({
    where: {
      author_id: userId,
      status:    { [Op.ne]: 'deleted' },
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['username', 'firstName', 'lastName'],
      },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
  })

  return {
    blogs:      rows,
    total:      count,
    page,
    totalPages: Math.ceil(count / limit),
  }
}

export async function getBlogById(id) {
  return Blog.findByPk(id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'email', 'firstName', 'lastName'],
      },
    ],
  })
}

export async function updateBlog({ id, userId, title, content, image_url }) {
  const blog = await Blog.findOne({ where: { id, author_id: userId } })
  if (!blog) return null

  blog.title   = title
  blog.content = content
  if (image_url !== undefined) blog.image_url = image_url
  blog.status = 'pending'

  await blog.save()
  return blog
}

export async function deleteBlog({ id, userId }) {
  const blog = await Blog.findOne({ where: { id, author_id: userId } })
  if (!blog) return false

  blog.status     = 'deleted'
  blog.deleted_at = new Date()
  await blog.save()
  return true
}
