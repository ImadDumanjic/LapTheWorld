import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/authMiddleware.js'
import {
  createBlogHandler,
  getBlogsHandler,
  getUserBlogsHandler,
  getBlogByIdHandler,
  updateBlogHandler,
  deleteBlogHandler,
} from '../controllers/blogController.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(Object.assign(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'), { status: 400 }))
    }
  },
})

const router = Router()

router.get('/',       getBlogsHandler)
router.post('/',      requireAuth, upload.single('image'), createBlogHandler)
router.get('/my',     requireAuth, getUserBlogsHandler)
router.get('/:id',    getBlogByIdHandler)
router.put('/:id',    requireAuth, upload.single('image'), updateBlogHandler)
router.delete('/:id', requireAuth, deleteBlogHandler)

export default router
