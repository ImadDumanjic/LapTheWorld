import { Router } from 'express'
import { registerUser, loginUser } from '../controllers/authController.js'
import { validateBody, validateRegisterInput } from '../middleware/validate.js'

const router = Router()

router.post('/register', validateBody(['username', 'email', 'password']), validateRegisterInput, registerUser)
router.post('/login', validateBody(['email', 'password']), loginUser)

export default router;
