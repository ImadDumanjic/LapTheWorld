const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1'

export async function fetchRaceCalendar() {
  const res = await fetch(`${JOLPICA_BASE}/current/races.json`)
  if (!res.ok) throw new Error(`F1 API error: ${res.status} ${res.statusText}`)

  const json = await res.json()
  const races = json?.MRData?.RaceTable?.Races
  if (!Array.isArray(races)) throw new Error('Unexpected response format from the F1 API')

  return {
    season: json?.MRData?.RaceTable?.season ?? 'Current',
    races,
  }
}
