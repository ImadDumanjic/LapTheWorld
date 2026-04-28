import { useState } from 'react'
import { login, register, logout, googleLogin } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const result = await login(data)
      setUser(result.user)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const result = await register(data)
      setUser(result.user)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const result = await googleLogin(data)
      setUser(result.user)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  return {
    user,
    error,
    loading,
    login: handleLogin,
    register: handleRegister,
    googleLogin: handleGoogleLogin,
    logout: handleLogout,
  }
}
