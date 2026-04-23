const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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
  const res = await fetch(`${BASE_URL}/api/admin/users`, { headers: getAuthHeaders() })
  return handleResponse(res)
}

export async function removeUser(id) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  return handleResponse(res)
}

export async function fetchAllBlogs() {
  const res = await fetch(`${BASE_URL}/api/admin/blogs`, { headers: getAuthHeaders() })
  return handleResponse(res)
}

export async function changeBlogStatus(id, status) {
  const res = await fetch(`${BASE_URL}/api/admin/blogs/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  })
  return handleResponse(res)
}
