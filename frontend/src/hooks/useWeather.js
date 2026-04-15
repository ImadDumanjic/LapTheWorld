import { useState } from 'react'

// ─── Weather hook ─────────────────────────────────────────────────────────────
//
// Currently returns { status: 'unavailable' }.
//
// To connect a real provider, replace the useState initialiser below with a
// useEffect + fetch call.  WeatherSection already handles all statuses:
//   'loading' | 'ready' | 'unavailable' | 'error'
//
// Expected data shape when status === 'ready':
// {
//   days: [
//     { label: 'FRI 23 MAY', condition: 'Sunny', icon: 'sunny', high: 26, low: 19 },
//     { label: 'SAT 24 MAY', condition: 'Partly Cloudy', icon: 'partly-cloudy', high: 24, low: 17 },
//     { label: 'SUN 25 MAY', condition: 'Overcast', icon: 'cloudy', high: 22, low: 15 },
//   ]
// }
//
// Icon values: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy'
//
// ── Suggested free provider — Open-Meteo (no API key required) ──────────────
// useEffect(() => {
//   if (!lat || !lng) return
//   setState({ status: 'loading', data: null, error: null })
//   fetch(
//     `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
//     `&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`
//   )
//     .then(r => r.json())
//     .then(raw => setState({ status: 'ready', data: transformOpenMeteo(raw), error: null }))
//     .catch(err => setState({ status: 'error', data: null, error: err.message }))
// }, [lat, lng])
//
// Or use the weather.location string with OpenWeatherMap geocode API.
// ─────────────────────────────────────────────────────────────────────────────

export default function useWeather({ location, lat, lng }) {
  // Replace this with a useEffect + fetch when connecting a real API
  const [state] = useState({ status: 'unavailable', data: null, error: null })
  return state
}
