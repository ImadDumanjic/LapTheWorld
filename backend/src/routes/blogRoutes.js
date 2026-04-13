import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/authMiddleware.js'
import { createBlogHandler, getBlogsHandler } from '../controllers/blogController.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    cb(null, allowed.includes(file.mimetype))
  },
})

const router = Router()

router.get('/',  getBlogsHandler)
router.post('/', requireAuth, upload.single('image'), createBlogHandler)

export default router
