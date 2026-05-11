import { Router } from 'express'
import { adminLogin, adminVerifyTotp, adminConfirmTotpSetup } from '../controllers/adminAuthController.js'
import { validateBody } from '../middleware/validate.js'

const router = Router()

router.post('/login',          validateBody(['email', 'password']),          adminLogin)
router.post('/verify-totp',    validateBody(['tempToken', 'totpCode']),      adminVerifyTotp)
router.post('/confirm-setup',  validateBody(['tempToken', 'totpCode']),      adminConfirmTotpSetup)

export default router
