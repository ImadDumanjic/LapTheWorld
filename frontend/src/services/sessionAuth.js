export const USER_TOKEN_KEY = 'userToken'

export function getUserToken() {
  return localStorage.getItem(USER_TOKEN_KEY)
}

export function getUserAuthHeaders(extraHeaders = {}) {
  const token = getUserToken()
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export function storeUserSession({ user, token }) {
  if (user?.role) localStorage.setItem('role', user.role)
  if (user?.id) localStorage.setItem('userId', String(user.id))
  if (token) localStorage.setItem(USER_TOKEN_KEY, token)
}

export function clearUserSession() {
  localStorage.removeItem('role')
  localStorage.removeItem('userId')
  localStorage.removeItem(USER_TOKEN_KEY)
}
