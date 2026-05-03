import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:3000/api/live'

const POLL_ACTIVE   = 5_000        // 5 s when a session is live
const POLL_INACTIVE = 5 * 60_000  // 5 min when no session is running

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function toTitleCase(str) {
  if (!str) return str
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatLapTime(str) {
  // F1 live timing sends lap times as "m:ss.mmm" strings or numeric seconds
  if (str == null) return '—'
  if (typeof str === 'number') {
    const m  = Math.floor(str / 60)
    const s  = Math.floor(str % 60)
    const ms = Math.round((str % 1) * 1000)
    return m > 0 ? `${m}:${String(s).padStart(2,'0')}.${String(ms).padStart(3,'0')}` : `${s}.${String(ms).padStart(3,'0')}`
  }
  return str
}

const TYRE_COLORS = {
  SOFT:         '#e8002d',
  MEDIUM:       '#ffd600',
  HARD:         '#f0f0f0',
  INTERMEDIATE: '#43b047',
  WET:          '#0067ff',
}

function TyreDot({ compound }) {
  if (!compound) return <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
  const upper = compound.toUpperCase()
  const color = TYRE_COLORS[upper] ?? 'rgba(255,255,255,0.4)'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
        background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}80`,
      }} />
      <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, letterSpacing: 1 }}>
        {upper.slice(0, 1)}
      </span>
    </span>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid rgba(0,210,255,0.15)',
        borderTopColor: '#00D2FF',
        animation: 'ltw-spin 0.8s linear infinite',
      }} />
    </div>
  )
}

function LiveBadge({ active }) {
  if (active) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 10px', borderRadius: 20,
        background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)',
        fontSize: 10, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#4ade80',
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: '#22c55e',
          animation: 'ltw-pulse 1.4s ease-in-out infinite', display: 'inline-block',
        }} />
        LIVE
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 20,
      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
      fontSize: 10, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.3)',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
      NO ACTIVE SESSION
    </span>
  )
}

function WeatherStrip({ weather }) {
  if (!weather || !Object.keys(weather).length) return null
  const items = [
    { label: 'TRACK TEMP', value: weather.TrackTemp    != null ? `${weather.TrackTemp}°C`    : '—' },
    { label: 'AIR TEMP',   value: weather.AirTemp      != null ? `${weather.AirTemp}°C`      : '—' },
    { label: 'HUMIDITY',   value: weather.Humidity     != null ? `${weather.Humidity}%`      : '—' },
    { label: 'RAINFALL',   value: weather.Rainfall     != null ? (weather.Rainfall ? 'Yes' : 'No') : '—' },
    { label: 'WIND SPEED', value: weather.WindSpeed    != null ? `${weather.WindSpeed} m/s`  : '—' },
  ]
  return (
    <div style={{
      display: 'flex', gap: 12, flexWrap: 'wrap',
      padding: '12px 20px', marginBottom: 20,
      background: 'rgba(0,210,255,0.04)', border: '1px solid rgba(0,210,255,0.12)', borderRadius: 12,
    }}>
      {items.map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 90 }}>
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '2px', color: 'rgba(0,210,255,0.5)', textTransform: 'uppercase' }}>
            {label}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Data processing ──────────────────────────────────────────────────────────

function buildRows(driverList, timingData) {
  // driverList: { "1": { RacingNumber, BroadcastName, TeamName, TeamColour, ... }, ... }
  // timingData: { Lines: { "1": { Position, GapToLeader, LastLapTime, BestLapTime, Stints, InPit, ... } } }
  const lines = timingData?.Lines ?? {}
  const rows = []

  for (const [num, timing] of Object.entries(lines)) {
    const driver = driverList?.[num] ?? {}
    const rawPos = parseInt(timing.Position, 10)
    const pos    = isNaN(rawPos) ? 99 : rawPos

    // Tyre compound from latest stint
    const stints   = timing.Stints ?? {}
    const stintArr = Object.values(stints)
    const lastStint = stintArr[stintArr.length - 1] ?? {}
    const compound  = lastStint.Compound ?? null

    // Pit stops count
    const pitCount = stintArr.filter(s => s.Compound).length - 1

    // Last lap time value string
    const lastLap = timing.LastLapTime?.Value ?? null
    const bestLap = timing.BestLapTime?.Value ?? null
    const isFastest = timing.LastLapTime?.OverallFastest === true

    let fullName
    if (driver.FirstName && driver.LastName) {
      fullName = toTitleCase(`${driver.FirstName} ${driver.LastName}`)
    } else if (driver.FullName || driver.BroadcastName) {
      fullName = toTitleCase(driver.FullName ?? driver.BroadcastName)
    } else {
      fullName = `Driver #${num}`
    }

    rows.push({
      num,
      pos,
      acronym:   driver.Tla ?? driver.BroadcastName?.split(' ').pop() ?? `#${num}`,
      fullName,
      teamName:  driver.TeamName ?? '—',
      teamColor: driver.TeamColour ? `#${driver.TeamColour}` : 'rgba(255,255,255,0.2)',
      gap:       timing.GapToLeader ?? null,
      interval:  timing.IntervalToPositionAhead?.Value ?? null,
      lastLap,
      bestLap,
      compound,
      pitCount:  Math.max(0, pitCount),
      inPit:     timing.InPit ?? false,
      isFastest,
    })
  }

  rows.sort((a, b) => a.pos - b.pos)
  return rows
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LiveTimingPage() {
  const navigate   = useNavigate()
  const intervalRef = useRef(null)

  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/auth', { replace: true }); return }

    let cancelled = false

    async function doFetch() {
      try {
        const res = await fetch(`${API}/all`, { headers: authHeaders() })
        if (res.status === 401) {
          if (!cancelled) navigate('/auth', { replace: true })
          return
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const raw = await res.json()
        if (cancelled) return

        setData(raw)
        setError(null)
        setLoading(false)

        // Reschedule with appropriate interval
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(doFetch, raw.sessionActive ? POLL_ACTIVE : POLL_INACTIVE)
      } catch (err) {
        if (cancelled) return
        setError('Could not reach the live timing service. Please check your connection.')
        setLoading(false)
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(doFetch, 30_000)
      }
    }

    doFetch()
    return () => {
      cancelled = true
      clearInterval(intervalRef.current)
    }
  }, [navigate])

  const sessionInfo  = data?.sessionInfo  ?? {}
  const driverList   = data?.driverList   ?? {}
  const timingData   = data?.timingData   ?? {}
  const weatherData  = data?.weatherData  ?? {}
  const lapCount     = data?.lapCount     ?? {}
  const active       = data?.sessionActive ?? false

  const sessionName  = sessionInfo.Name ?? sessionInfo.Type ?? '—'
  const circuitName  = sessionInfo.Meeting?.Circuit?.ShortName ?? sessionInfo.Meeting?.Name ?? '—'
  const countryName  = sessionInfo.Meeting?.Country?.Name ?? ''

  const rows = buildRows(driverList, timingData)
  const hasDrivers = rows.length > 0

  const totalLaps    = lapCount.TotalLaps ?? null
  const currentLap   = lapCount.CurrentLap ?? null

  return (
    <>
      <style>{`
        @keyframes ltw-spin  { to { transform: rotate(360deg) } }
        @keyframes ltw-pulse {
          0%, 100% { opacity: 1; transform: scale(1) }
          50%       { opacity: 0.5; transform: scale(1.3) }
        }
      `}</style>

      <div className="bg-page-gradient min-h-svh px-6 pb-14 pt-36 sm:px-12">
        <div className="max-w-[1200px] mx-auto">

          {/* Page heading */}
          <div style={{ marginBottom: 24 }}>
            <p style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 11, fontWeight: 800, letterSpacing: '4px',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12,
            }}>
              <span>🏎</span>
              <span>Formula 1 · Live Session Data</span>
            </p>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800,
              color: '#fff', textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1,
            }}>
              Live Timing
            </h1>
          </div>

          {/* Session info bar */}
          <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12,
            padding: '14px 20px', marginBottom: 14,
            background: 'rgba(15, 32, 39, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
          }}>
            <LiveBadge active={active} />
            {!loading && sessionInfo.Type && (
              <>
                <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>{sessionName}</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                  {circuitName}{countryName ? `, ${countryName}` : ''}
                </span>
                {currentLap != null && totalLaps != null && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 11, fontWeight: 700,
                    color: 'rgba(255,255,255,0.5)', letterSpacing: 1,
                  }}>
                    LAP {currentLap} / {totalLaps}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Loading */}
          {loading && <Spinner />}

          {/* Error */}
          {!loading && error && (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: 'rgba(15, 32, 39, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
            }}>
              <p style={{ fontSize: 13, color: 'rgba(255,120,120,0.8)', marginBottom: 20 }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 28px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                  border: '1px solid rgba(0,210,255,0.3)', background: 'rgba(0,210,255,0.08)',
                  color: '#00D2FF', fontSize: 11, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,210,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,210,255,0.08)'}
              >
                Retry
              </button>
            </div>
          )}

          {/* No active session */}
          {!loading && !error && !active && (
            <>
              <WeatherStrip weather={weatherData} />
              <div style={{
                textAlign: 'center', padding: '80px 20px',
                background: 'rgba(15, 32, 39, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
              }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: 1, marginBottom: 10 }}>
                  No Session Currently Active
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', maxWidth: 440, margin: '0 auto' }}>
                  Live timing will appear here automatically when a Formula 1 session begins.
                </p>
                {sessionInfo.Type && (
                  <p style={{ marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '1px' }}>
                    Last session: {sessionName}{circuitName !== '—' ? ` — ${circuitName}` : ''}
                  </p>
                )}
                <p style={{ marginTop: 16, fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '1px' }}>
                  Checking for new session every 5 minutes
                </p>
              </div>
            </>
          )}

          {/* Active session */}
          {!loading && !error && active && (
            <>
              <WeatherStrip weather={weatherData} />

              {!hasDrivers ? (
                <div style={{
                  textAlign: 'center', padding: '60px 20px',
                  background: 'rgba(15, 32, 39, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Waiting for timing data…</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%', borderCollapse: 'collapse',
                    background: 'rgba(15, 32, 39, 0.6)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, overflow: 'hidden',
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        {['POS', 'DRIVER', 'TEAM', 'GAP', 'LAST LAP', 'BEST LAP', 'TYRE', 'PITS'].map(h => (
                          <th key={h} style={{
                            padding: '11px 16px',
                            textAlign: h === 'POS' || h === 'PITS' ? 'center' : 'left',
                            fontSize: 9, fontWeight: 800, letterSpacing: '2px',
                            textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, idx) => (
                        <tr key={row.num} style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          background: row.isFastest
                            ? 'rgba(126,34,206,0.1)'
                            : row.inPit
                            ? 'rgba(234,179,8,0.05)'
                            : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                          transition: 'background 0.3s ease',
                        }}>
                          {/* Position */}
                          <td style={{
                            padding: '12px 16px', textAlign: 'center',
                            fontSize: 13, fontWeight: 800,
                            color: idx === 0 ? '#ffd600' : 'rgba(255,255,255,0.6)',
                          }}>
                            {row.pos > 0 ? row.pos : idx + 1}
                          </td>

                          {/* Driver */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 3, height: 30, borderRadius: 2, flexShrink: 0,
                                background: row.teamColor, boxShadow: `0 0 8px ${row.teamColor}60`,
                              }} />
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                                  {row.fullName}
                                  {row.isFastest && (
                                    <span style={{ marginLeft: 8, fontSize: 9, color: '#c084fc', fontWeight: 800, letterSpacing: '1px' }}>
                                      ⚡ FASTEST
                                    </span>
                                  )}
                                  {row.inPit && (
                                    <span style={{ marginLeft: 8, fontSize: 9, color: '#facc15', fontWeight: 800, letterSpacing: '1px' }}>
                                      PIT
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1, letterSpacing: '1px' }}>
                                  {row.acronym}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Team */}
                          <td style={{ padding: '12px 16px', fontSize: 11, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>
                            {row.teamName}
                          </td>

                          {/* Gap */}
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: row.pos === 1 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.7)' }}>
                            {row.pos === 1 ? 'Leader' : (row.gap ? row.gap : '—')}
                          </td>

                          {/* Last lap */}
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: row.isFastest ? '#c084fc' : 'rgba(255,255,255,0.7)' }}>
                            {formatLapTime(row.lastLap)}
                          </td>

                          {/* Best lap */}
                          <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.45)' }}>
                            {formatLapTime(row.bestLap)}
                          </td>

                          {/* Tyre */}
                          <td style={{ padding: '12px 16px' }}>
                            <TyreDot compound={row.compound} />
                          </td>

                          {/* Pits */}
                          <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: row.pitCount > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}>
                            {row.pitCount || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p style={{ marginTop: 10, fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', textAlign: 'right' }}>
                    Updates every 5s · via F1 Live Timing
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  )
}
