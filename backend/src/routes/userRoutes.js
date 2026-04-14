import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { getProfile, updateProfile, deleteAccount } from '../controllers/userController.js'

const router = Router()

router.get('/me', requireAuth, getProfile)
router.put('/:id', requireAuth, updateProfile)
router.delete('/:id', requireAuth, deleteAccount)

export default router
