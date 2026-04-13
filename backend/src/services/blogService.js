import { Op } from 'sequelize'
import Blog from '../../models/Blog.js'
import User from '../../models/User.js'

const PAGE_SIZE = 5

export async function createBlog({ title, content, image_url, author_id }) {
  return Blog.create({ title, content, image_url, author_id })
}

export async function getBlogs({ page = 1 } = {}) {
  const limit  = PAGE_SIZE
  const offset = (page - 1) * limit

  const { count, rows } = await Blog.findAndCountAll({
    where: {
      status: { [Op.notIn]: ['rejected', 'deleted'] },
    },
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
