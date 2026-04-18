import { useState, useEffect } from 'react'

// WMO Weather Interpretation Codes → icon type
const WMO_ICON = {
  0: 'sunny', 1: 'sunny', 2: 'partly-cloudy', 3: 'cloudy',
  45: 'cloudy', 48: 'cloudy',
  51: 'rainy', 53: 'rainy', 55: 'rainy',
  56: 'rainy', 57: 'rainy',
  61: 'rainy', 63: 'rainy', 65: 'rainy',
  66: 'rainy', 67: 'rainy',
  71: 'cloudy', 73: 'cloudy', 75: 'cloudy', 77: 'cloudy',
  80: 'rainy', 81: 'rainy', 82: 'rainy',
  85: 'cloudy', 86: 'cloudy',
  95: 'rainy', 96: 'rainy', 99: 'rainy',
}

// WMO codes → readable condition string
const WMO_LABEL = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Freezing Fog',
  51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  56: 'Freezing Drizzle', 57: 'Heavy Freezing Drizzle',
  61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
  66: 'Freezing Rain', 67: 'Heavy Freezing Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
  80: 'Rain Showers', 81: 'Rain Showers', 82: 'Heavy Showers',
  85: 'Snow Showers', 86: 'Heavy Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
}

function toISO(date) {
  return date.toISOString().slice(0, 10)
}

function formatLabel(dateStr) {
  const d = new Date(`${dateStr}T12:00:00Z`)
  const weekday = d.toLocaleString('en-US', { weekday: 'short', timeZone: 'UTC' }).toUpperCase()
  const day     = d.getUTCDate()
  const month   = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase()
  return `${weekday} ${day} ${month}`
}

// lat, lng: coordinates from the guide
// raceDate: ISO string 'YYYY-MM-DD' for race day (Sunday)
export default function useWeather({ lat, lng, raceDate }) {
  const [state, setState] = useState({ status: 'loading', data: null })

  useEffect(() => {
    if (!lat || !lng || !raceDate) {
      setState({ status: 'unavailable', data: null })
      return
    }

    const raceMs  = new Date(`${raceDate}T14:00:00Z`).getTime()
    const now     = Date.now()
    const friMs   = raceMs - 2 * 86_400_000
    const daysUntilFri = Math.ceil((friMs - now) / 86_400_000)

    // Race weekend already over
    if (raceMs < now) {
      setState({ status: 'unavailable', data: { reason: 'past' } })
      return
    }

    // Open-Meteo only provides a 16-day forecast window
    if (daysUntilFri > 16) {
      const availableOn = new Date(friMs - 16 * 86_400_000)
      setState({
        status: 'unavailable',
        data: {
          reason: 'too-early',
          availableFrom: availableOn.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }),
        },
      })
      return
    }

    setState({ status: 'loading', data: null })

    const startDate = toISO(new Date(friMs))
    const endDate   = raceDate

    fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lng}` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
      `&timezone=auto&start_date=${startDate}&end_date=${endDate}`
    )
      .then(r => { if (!r.ok) throw new Error('API error'); return r.json() })
      .then(raw => {
        const { time, weathercode, temperature_2m_max, temperature_2m_min } = raw.daily
        const days = time.map((dateStr, i) => ({
          label:     formatLabel(dateStr),
          condition: WMO_LABEL[weathercode[i]] ?? 'Unknown',
          icon:      WMO_ICON[weathercode[i]]  ?? 'cloudy',
          high:      Math.round(temperature_2m_max[i]),
          low:       Math.round(temperature_2m_min[i]),
        }))
        setState({ status: 'ready', data: { days } })
      })
      .catch(() => setState({ status: 'error', data: null }))
  }, [lat, lng, raceDate])

  return state
}
