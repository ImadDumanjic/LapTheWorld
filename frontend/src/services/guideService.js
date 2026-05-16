const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const GUIDE_CACHE_TTL = 10 * 60 * 1000

function readCachedGuide(slug) {
  try {
    const raw = sessionStorage.getItem(`guide:${slug}`)
    if (!raw) return null

    const cached = JSON.parse(raw)
    if (!cached?.data || Date.now() - cached.savedAt > GUIDE_CACHE_TTL) return null
    return cached.data
  } catch {
    return null
  }
}

function cacheGuide(slug, data) {
  try {
    sessionStorage.setItem(`guide:${slug}`, JSON.stringify({
      savedAt: Date.now(),
      data,
    }))
  } catch {
    // Cache is an optimization only.
  }
}

export async function fetchGuides() {
  const res = await fetch(`${BASE_URL}/api/guides`)
  if (!res.ok) throw new Error('Failed to fetch guides')
  return res.json()
}

export async function fetchGuideBySlug(slug) {
  const cached = readCachedGuide(slug)
  if (cached) return cached

  const res = await fetch(`${BASE_URL}/api/guides/${slug}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch guide')
  const guide = await res.json()
  cacheGuide(slug, guide)
  return guide
}
