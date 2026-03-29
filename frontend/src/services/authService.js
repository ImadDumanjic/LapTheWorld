const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function login(data) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed')
  const result = await res.json()
  if (result.token) localStorage.setItem('token', result.token)
  return result
}

export async function register(data) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed')
  const result = await res.json()
  if (result.token) localStorage.setItem('token', result.token)
  return result
}

export function logout() {
  localStorage.removeItem('token')
}
