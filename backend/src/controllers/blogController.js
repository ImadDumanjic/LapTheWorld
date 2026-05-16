import { createBlog, getBlogs, getUserBlogs, getBlogById, updateBlog, deleteBlog } from '../services/blogService.js'
import { sendBlogSubmissionAdminEmail } from '../services/emailService.js'
import { sanitizePlainText } from '../utils/sanitize.js'
import { uploadToSupabase } from '../config/supabase.js'
import User from '../../models/User.js'
import sharp from 'sharp'

const TITLE_MAX   = 200
const CONTENT_MAX = 10_000

async function processImageUpload(file) {
  let outputBuffer
  try {
    outputBuffer = await sharp(file.buffer)
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toBuffer()
  } catch (err) {
    throw err
  }

  const originalName = file.originalname.replace(/\.[^.]+$/, '.webp')
  let publicUrl
  try {
    ;({ publicUrl } = await uploadToSupabase({
      buffer: outputBuffer,
      mimetype: 'image/webp',
      originalName,
      folder: 'blogs',
    }))
  } catch (err) {
    throw err
  }

  return publicUrl
}

function validateBlogFields(title, content) {
  if (!title)   return 'Title is required'
  if (!content) return 'Content is required'
  if (title.length > TITLE_MAX)     return `Title must be ${TITLE_MAX} characters or fewer`
  if (content.length > CONTENT_MAX) return `Content must be ${CONTENT_MAX} characters or fewer`
  return null
}

export async function createBlogHandler(req, res) {
  try {
    const title   = sanitizePlainText(req.body.title   ?? '')
    const content = sanitizePlainText(req.body.content ?? '')

    const validationError = validateBlogFields(title, content)
    if (validationError) return res.status(400).json({ message: validationError })

    let image_url = null
    if (req.file) image_url = await processImageUpload(req.file)

    const blog = await createBlog({ title, content, image_url, author_id: req.user.id })

    const author = await User.findByPk(req.user.id, {
      attributes: ['username', 'email', 'firstName', 'lastName'],
    })

    sendBlogSubmissionAdminEmail({ blog, author }).catch(() => {})

    res.status(201).json(blog)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function getBlogsHandler(req, res) {
  try {
    const page   = Math.max(1, parseInt(req.query.page, 10) || 1)
    const result = await getBlogs({ page })
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getUserBlogsHandler(req, res) {
  try {
    const page   = Math.max(1, parseInt(req.query.page, 10) || 1)
    const result = await getUserBlogs({ userId: req.user.id, page })
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function getBlogByIdHandler(req, res) {
  try {
    const blog = await getBlogById(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Blog not found' })
    res.json(blog)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export async function updateBlogHandler(req, res) {
  try {
    const existing = await getBlogById(req.params.id)
    if (!existing || existing.status === 'deleted') return res.status(404).json({ message: 'Blog not found' })
    if (existing.author_id !== req.user.id)         return res.status(403).json({ message: 'Forbidden' })

    const title   = sanitizePlainText(req.body.title   ?? '')
    const content = sanitizePlainText(req.body.content ?? '')

    const validationError = validateBlogFields(title, content)
    if (validationError) return res.status(400).json({ message: validationError })

    let image_url
    if (req.file) {
      image_url = await processImageUpload(req.file)
    } else if (req.body.keep_image === 'true') {
      image_url = existing.image_url
    } else {
      image_url = null
    }

    const blog = await updateBlog({ id: req.params.id, userId: req.user.id, title, content, image_url })

    const author = await User.findByPk(req.user.id, {
      attributes: ['username', 'email', 'firstName', 'lastName'],
    })

    sendBlogSubmissionAdminEmail({ blog, author, isEdit: true }).catch(() => {})

    res.json(blog)
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function deleteBlogHandler(req, res) {
  try {
    const existing = await getBlogById(req.params.id)
    if (!existing || existing.status === 'deleted') return res.status(404).json({ message: 'Blog not found' })
    if (existing.author_id !== req.user.id)         return res.status(403).json({ message: 'Forbidden' })

    // TODO: cleanup orphaned uploads — call deleteFromSupabase(existing.image_url) here
    await deleteBlog({ id: req.params.id, userId: req.user.id })
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
