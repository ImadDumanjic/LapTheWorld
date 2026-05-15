import { Router } from 'express'
import { registerUser, loginUser, logoutUser, requestPasswordResetHandler, resetPasswordHandler } from '../controllers/authController.js'
import { googleLoginController } from '../controllers/googleAuthController.js'
import { validateBody, validateRegisterInput } from '../middleware/validate.js'

const router = Router()

router.post('/register', validateBody(['username', 'email', 'password']), validateRegisterInput, registerUser)
router.post('/login', validateBody(['email', 'password']), loginUser)
router.post('/logout', logoutUser)
router.post('/forgot-password', validateBody(['email']), requestPasswordResetHandler)
router.post('/reset-password', validateBody(['token', 'newPassword']), resetPasswordHandler)
router.post('/google/login', googleLoginController)

export default router
