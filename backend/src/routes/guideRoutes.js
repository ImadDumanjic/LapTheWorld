import { Router } from 'express'
import { getGuidesHandler, getGuideBySlugHandler } from '../controllers/guideController.js'

const router = Router()

router.get('/',       getGuidesHandler)
router.get('/:slug',  getGuideBySlugHandler)

export default router
