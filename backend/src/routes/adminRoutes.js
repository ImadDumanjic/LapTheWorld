import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { requireAdmin } from '../middleware/adminMiddleware.js'
import { getAllUsers, deleteUser, banUser, getAllBlogs, updateBlogStatus } from '../controllers/adminController.js'

const router = Router()

router.use(requireAuth)
router.use(requireAdmin)

router.get('/users', getAllUsers)
router.delete('/users/:id', deleteUser)
router.patch('/users/:id/ban', banUser)
router.get('/blogs', getAllBlogs)
router.patch('/blogs/:id/status', updateBlogStatus)

export default router
