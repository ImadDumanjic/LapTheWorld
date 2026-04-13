const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function authHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function getBlogImageUrl(image_url) {
  if (!image_url) return null
  if (image_url.startsWith('http')) return image_url
  return `${BASE_URL}${image_url}`
}

export async function fetchBlogs(page = 1) {
  const res = await fetch(`${BASE_URL}/api/blogs?page=${page}`)
  if (!res.ok) throw new Error('Failed to fetch blogs')
  return res.json()
}

export async function createBlog(formData) {
  const res = await fetch(`${BASE_URL}/api/blogs`, {
    method: 'POST',
    headers: authHeader(), // no Content-Type — let browser set multipart boundary
    body: formData,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to create blog')
  }
  return res.json()
}
