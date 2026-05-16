import { getUserAuthHeaders } from './sessionAuth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const BLOG_REQUEST_TIMEOUT_MS = 45_000

async function fetchWithTimeout(url, options = {}, timeoutMs = BLOG_REQUEST_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again with a smaller image.')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }
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
  const res = await fetchWithTimeout(`${BASE_URL}/api/blogs`, {
    method: 'POST',
    headers: getUserAuthHeaders(),
    credentials: 'include',
    body: formData,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to create blog')
  }
  return res.json()
}

export async function fetchMyBlogs(page = 1) {
  const res = await fetch(`${BASE_URL}/api/blogs/my?page=${page}`, {
    headers: getUserAuthHeaders(),
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const err = new Error(data.message || 'Failed to fetch your blogs')
    err.status = res.status
    throw err
  }
  return res.json()
}

export async function updateBlog(id, formData) {
  const res = await fetchWithTimeout(`${BASE_URL}/api/blogs/${id}`, {
    method: 'PUT',
    headers: getUserAuthHeaders(),
    credentials: 'include',
    body: formData,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to update blog')
  }
  return res.json()
}

export async function deleteBlog(id) {
  const res = await fetch(`${BASE_URL}/api/blogs/${id}`, {
    method: 'DELETE',
    headers: getUserAuthHeaders(),
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to delete blog')
  }
}
