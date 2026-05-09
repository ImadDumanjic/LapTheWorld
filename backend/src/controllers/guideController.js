import { getAllGuides, getGuideBySlug } from '../services/guideService.js'

export async function getGuidesHandler(req, res) {
  try {
    const guides = await getAllGuides()
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
    res.json(guide)
  } catch (err) {
    console.error('getGuideBySlugHandler error:', err)
    res.status(500).json({ message: err.message })
  }
}
