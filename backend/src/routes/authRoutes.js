import { Router } from 'express'
import { registerUser, loginUser, requestPasswordResetHandler, resetPasswordHandler } from '../controllers/authController.js'
import { validateBody, validateRegisterInput } from '../middleware/validate.js'

const router = Router()

router.post('/register', validateBody(['username', 'email', 'password']), validateRegisterInput, registerUser)
router.post('/login', validateBody(['email', 'password']), loginUser)
router.post('/forgot-password', validateBody(['email']), requestPasswordResetHandler)
router.post('/reset-password', validateBody(['token', 'newPassword']), resetPasswordHandler)

export default router
