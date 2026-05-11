import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { getProfile, updateProfile, deleteAccount, verifyPassword, changePassword } from '../controllers/userController.js'

const router = Router()

router.get('/me', requireAuth, getProfile)
router.put('/:id', requireAuth, updateProfile)
router.delete('/:id', requireAuth, deleteAccount)
router.post('/:id/verify-password', requireAuth, verifyPassword)
router.patch('/:id/password', requireAuth, changePassword)

export default router
