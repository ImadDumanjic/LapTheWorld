import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { liveState } from '../services/f1LiveTimingService.js'

const router = Router()

router.get('/all', requireAuth, (_req, res) => {
  res.json(liveState)
})

export default router
