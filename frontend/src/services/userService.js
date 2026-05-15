const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function jsonHeaders() {
  return { 'Content-Type': 'application/json' }
}

// Returns the stored user ID without decoding the JWT (which is now httpOnly)
export function getTokenUserId() {
  return localStorage.getItem('userId') || null
}

export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/api/users/me`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to load profile')
  return res.json()
}

export async function updateProfile(id, data) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: jsonHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update profile')
  return res.json()
}

export async function deleteAccount(id) {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete account')
}

export async function verifyCurrentPassword(id, currentPassword) {
  const res = await fetch(`${BASE_URL}/api/users/${id}/verify-password`, {
    method: 'POST',
    headers: jsonHeaders(),
    credentials: 'include',
    body: JSON.stringify({ currentPassword }),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Verification failed')
  return res.json()
}

export async function changePassword(id, currentPassword, newPassword) {
  const res = await fetch(`${BASE_URL}/api/users/${id}/password`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to change password')
  return res.json()
}

export async function exportUserData() {
  const res = await fetch(`${BASE_URL}/api/users/me/export`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to export data')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'laptheworld-data.json'
  a.click()
  URL.revokeObjectURL(url)
}
