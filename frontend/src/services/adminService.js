const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Admin uses a separate auth flow with its token stored in localStorage.
function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    throw err
  }
  return res.status === 204 ? null : res.json()
}

export async function fetchAllUsers() {
  const res = await fetch(`${BASE_URL}/api/admin/users`, { headers: getAuthHeaders(), credentials: 'include' })
  return handleResponse(res)
}

export async function setBanStatus(id, banned) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}/ban`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ banned }),
  })
  return handleResponse(res)
}

export async function removeUser(id) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  })
  return handleResponse(res)
}

export async function fetchAllBlogs() {
  const res = await fetch(`${BASE_URL}/api/admin/blogs`, { headers: getAuthHeaders(), credentials: 'include' })
  return handleResponse(res)
}

export async function changeBlogStatus(id, status) {
  const res = await fetch(`${BASE_URL}/api/admin/blogs/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ status }),
  })
  return handleResponse(res)
}
