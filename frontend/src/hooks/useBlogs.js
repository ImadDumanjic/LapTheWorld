import { useState, useEffect, useCallback } from 'react'
import { fetchBlogs } from '../services/blogService'

export function useBlogs(initialPage = 1) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [page,    setPage]    = useState(initialPage)

  const load = useCallback(async (p) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchBlogs(p)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(page) }, [page, load])

  const refresh = useCallback(() => load(page), [load, page])

  return { data, loading, error, page, setPage, refresh }
}
