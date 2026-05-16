import { clearUserSession, storeUserSession } from './sessionAuth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// User auth primarily uses the httpOnly cookie. The stored bearer token is a
// fallback for production browsers that block cross-site cookies.

function jsonHeaders() {
  return { 'Content-Type': 'application/json' }
}

export async function login(data) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed')
  const result = await res.json()
  storeUserSession(result)
  return result
}

export async function register(data) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: jsonHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed')
  const result = await res.json()
  storeUserSession(result)
  return result
}

export async function googleLogin(data) {
  const res = await fetch(`${BASE_URL}/api/auth/google/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    credentials: 'include',
    body: JSON.stringify({ idToken: data.credential }),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Google sign-in failed')
  const result = await res.json()
  storeUserSession(result)
  return result
}

export async function logout() {
  try {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Continue even if network fails — clear local state regardless
  }
  clearUserSession()
}

export async function requestPasswordReset(email) {
  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to send reset email')
}

export async function adminLogin(data) {
  const res = await fetch(`${BASE_URL}/api/admin-auth/login`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed')
  return res.json()
}

export async function adminVerifyTotp(data) {
  const res = await fetch(`${BASE_URL}/api/admin-auth/verify-totp`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Verification failed')
  return res.json()
}

export async function adminConfirmTotpSetup(data) {
  const res = await fetch(`${BASE_URL}/api/admin-auth/confirm-setup`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error((await res.json()).message || 'Setup failed')
  return res.json()
}

export async function resetPassword(token, newPassword) {
  const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ token, newPassword }),
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.message || 'Failed to reset password')
    err.status = res.status
    throw err
  }
  return data
}
