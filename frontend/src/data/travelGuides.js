import guides from '../../travel-guides.json'

export default guides

export function getGuideBySlug(slug) {
  return guides.find(g => g.slug === slug) ?? null
}
