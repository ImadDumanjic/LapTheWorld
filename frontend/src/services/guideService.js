const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function fetchGuides() {
  const res = await fetch(`${BASE_URL}/api/guides`)
  if (!res.ok) throw new Error('Failed to fetch guides')
  return res.json()
}

export async function fetchGuideBySlug(slug) {
  const res = await fetch(`${BASE_URL}/api/guides/${slug}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch guide')
  return res.json()
}
