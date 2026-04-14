const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export function getTokenUserId() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1])).id
  } catch {
    return null
  }
}

export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load profile')
  return res.json()
}

export async function updateProfile(id, data) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update profile')
  return res.json()
}

export async function deleteAccount(id) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete account')
}
