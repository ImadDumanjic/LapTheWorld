import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { requireAdmin } from '../middleware/adminMiddleware.js'
import { getAllUsers, deleteUser, getAllBlogs, updateBlogStatus } from '../controllers/adminController.js'

const router = Router()

router.use(requireAuth)
router.use(requireAdmin)

router.get('/users', getAllUsers)
router.delete('/users/:id', deleteUser)
router.get('/blogs', getAllBlogs)
router.patch('/blogs/:id/status', updateBlogStatus)

export default router
