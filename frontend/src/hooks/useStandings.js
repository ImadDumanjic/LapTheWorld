import { useState, useEffect } from 'react'

/**
 * Generic hook for fetching standings data.
 *
 * @param {() => Promise<{ season: string, rows: object[] }>} fetcher
 *   A stable (module-level) function from standingsService.
 *
 * @returns {{ data: { season: string, rows: object[] } | null, loading: boolean, error: string | null }}
 */
export default function useStandings(fetcher) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('[useStandings]', err)
          setError(err.message ?? 'Failed to load standings')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [fetcher]) // fetcher is a stable module-level export — runs once on mount

  return { data, loading, error }
}
