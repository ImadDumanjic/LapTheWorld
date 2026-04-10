const JOLPICA_BASE = 'https://api.jolpi.ca/ergast/f1'

function extractSeason(json) {
  return json?.MRData?.StandingsTable?.season ?? 'Current'
}

function extractStandingsList(json) {
  const list = json?.MRData?.StandingsTable?.StandingsLists?.[0]
  if (!list) throw new Error('Unexpected response format from the F1 API')
  return list
}

export async function fetchDriverStandings() {
  const res = await fetch(`${JOLPICA_BASE}/current/driverStandings.json`)
  if (!res.ok) throw new Error(`F1 API error: ${res.status} ${res.statusText}`)

  const json = await res.json()
  const list = extractStandingsList(json)

  return {
    season: extractSeason(json),
    rows: list.DriverStandings.map((s) => ({
      position:    parseInt(s.position),
      name:        `${s.Driver.givenName} ${s.Driver.familyName}`,
      nationality: s.Driver.nationality ?? '—',
      team:        s.Constructors?.[0]?.name ?? '—',
      teamId:      s.Constructors?.[0]?.constructorId ?? null,
      points:      s.points,
      wins:        parseInt(s.wins),
    })),
  }
}

export async function fetchConstructorStandings() {
  const res = await fetch(`${JOLPICA_BASE}/current/constructorStandings.json`)
  if (!res.ok) throw new Error(`F1 API error: ${res.status} ${res.statusText}`)

  const json = await res.json()
  const list = extractStandingsList(json)

  return {
    season: extractSeason(json),
    rows: list.ConstructorStandings.map((s) => ({
      position: parseInt(s.position),
      name: s.Constructor.name,
      nationality: s.Constructor.nationality,
      points: s.points,
      wins: parseInt(s.wins),
    })),
  }
}
