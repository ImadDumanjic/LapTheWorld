import { getAllGuides, getGuideBySlug } from '../services/guideService.js'

const GUIDE_CACHE_HEADER = 'public, max-age=300, stale-while-revalidate=600'

export async function getGuidesHandler(req, res) {
  try {
    const guides = await getAllGuides()
    res.set('Cache-Control', GUIDE_CACHE_HEADER)
    res.json(guides)
  } catch (err) {
    console.error('getGuidesHandler error:', err)
    res.status(500).json({ message: err.message })
  }
}

export async function getGuideBySlugHandler(req, res) {
  try {
    const guide = await getGuideBySlug(req.params.slug)
    if (!guide) return res.status(404).json({ message: 'Guide not found' })
    res.set('Cache-Control', GUIDE_CACHE_HEADER)
    res.json(guide)
  } catch (err) {
    console.error('getGuideBySlugHandler error:', err)
    res.status(500).json({ message: err.message })
  }
}
