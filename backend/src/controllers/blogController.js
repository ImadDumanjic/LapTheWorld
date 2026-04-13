import path from 'path'
import { fileURLToPath } from 'url'
import { createBlog, getBlogs } from '../services/blogService.js'
import { sanitizePlainText } from '../utils/sanitize.js'
import sharp from 'sharp'

const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '../../uploads')

const TITLE_MAX   = 200
const CONTENT_MAX = 10_000

export async function createBlogHandler(req, res) {
  try {
    const title   = sanitizePlainText(req.body.title   ?? '')
    const content = sanitizePlainText(req.body.content ?? '')

    if (!title)   return res.status(400).json({ message: 'Title is required' })
    if (!content) return res.status(400).json({ message: 'Content is required' })

    if (title.length > TITLE_MAX)
      return res.status(400).json({ message: `Title must be ${TITLE_MAX} characters or fewer` })

    if (content.length > CONTENT_MAX)
      return res.status(400).json({ message: `Content must be ${CONTENT_MAX} characters or fewer` })

    let image_url = null

    if (req.file) {
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`
      await sharp(req.file.buffer)
        .resize(1200, 630, { fit: 'cover', position: 'centre' })
        .webp({ quality: 82 })
        .toFile(path.join(UPLOADS_DIR, filename))
      image_url = `/uploads/${filename}`
    }

    const blog = await createBlog({ title, content, image_url, author_id: req.user.id })
    res.status(201).json(blog)
  } catch (err) {
    console.error('createBlogHandler error:', err)
    res.status(err.status || 500).json({ message: err.message })
  }
}

export async function getBlogsHandler(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const result = await getBlogs({ page })
    res.json(result)
  } catch (err) {
    console.error('getBlogsHandler error:', err)
    res.status(500).json({ message: err.message })
  }
}
