import { useState, useEffect } from 'react'
import useStandings from '../hooks/useStandings'
import { fetchRaceCalendar } from '../services/calendarService'
import { getFlagUrl } from '../components/calendar/countryFlags'


function getRaceDateTime(race) {
  const time = race.time ?? '14:00:00Z'
  return new Date(`${race.date}T${time}`)
}

function getCountdown(raceDate, now) {
  const diff = raceDate.getTime() - now
  if (diff <= 0) return { finished: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  const total = Math.floor(diff / 1000)
  return {
    finished: false,
    days:    Math.floor(total / 86400),
    hours:   Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  })
}

const pad = (n) => String(n).padStart(2, '0')

// ─── Countdown unit ───────────────────────────────────────────────────────────

function CountdownUnit({ value, label, accent }) {
  return (
    <div className="flex flex-col items-center flex-1">
      <div
        className="w-full flex items-center justify-center rounded-md py-3 mb-1"
        style={accent
          ? { background: '#2C5364' }
          : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.07)' }
        }
      >
        <span className="text-white font-bold text-[14px] leading-none tabular-nums">
          {pad(value)}
        </span>
      </div>
      <span className="text-white/30 text-[7px] uppercase tracking-[1.5px]">{label}</span>
    </div>
  )
}

// ─── Race card ────────────────────────────────────────────────────────────────

function RaceCard({ race, now, isNext }) {
  const raceDate = getRaceDateTime(race)
  const { finished, days, hours, minutes, seconds } = getCountdown(raceDate, now)
  const country     = race.Circuit.Location.country
  const locality    = race.Circuit.Location.locality
  const circuitName = race.Circuit.circuitName
  const flagUrl     = getFlagUrl(country)

  return (
    <div
      className="relative overflow-hidden rounded-xl h-[340px] border border-white/[0.06] group"
      style={isNext ? {
        // Reuse the exact same glow treatment as the login form container in AuthPage
        boxShadow: '0 0 0 3px #2C5364, 0 0 15px 3px rgba(44,83,100,0.6), 0 0 35px 8px rgba(44,83,100,0.3), 0 0 70px 15px rgba(44,83,100,0.1)',
      } : undefined}
    >

      {/* Flag background */}
      {flagUrl ? (
        <img
          src={flagUrl}
          alt={country}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a3340, #0F2027)' }} />
      )}

      {/* Base dark wash so flag is never too bright */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)' }} />

      {/* Bottom gradient — strong at base for text readability */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.2) 65%, transparent 82%)' }}
      />

      {/* Finished: slight full-card dim + narrow checkered strip through the middle */}
      {finished && (
        <>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.22)' }} />
          {/* Slim finish-line strip — motorsport-inspired, positioned across the card mid-section */}
          <div
            className="absolute left-0 right-0"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              height: '45px',
              backgroundImage: [
                'linear-gradient(45deg, rgba(255,255,255,0.13) 25%, transparent 25%)',
                'linear-gradient(-45deg, rgba(255,255,255,0.13) 25%, transparent 25%)',
                'linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.13) 75%)',
                'linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.13) 75%)',
              ].join(','),
              backgroundSize: '18px 18px',
              backgroundPosition: '0 0, 0 9px, 9px -9px, -9px 0px',
            }}
          />
        </>
      )}

      {/* Card content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">

        {/* Top row: round + finished badge */}
        <div className="flex items-start justify-between">
          <span className="text-white/35 text-[9px] uppercase tracking-[3px] font-semibold">
            Round {race.round}
          </span>
          {finished && (
            <span
              className="text-[8px] uppercase tracking-[1.5px] font-bold px-2 py-0.5 rounded-full"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              Finished
            </span>
          )}
          {isNext && !finished && (
            <span
              className="text-[8px] uppercase tracking-[1.5px] font-bold px-2 py-0.5 rounded-full"
              style={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Next Race
            </span>
          )}
        </div>

        {/* Bottom: race info + countdown — centered */}
        <div className="text-center">
          <p className="text-white/45 text-[12px] uppercase tracking-[3px] font-semibold mb-1.5">
            {country}
          </p>
          <h3 className="text-white text-[18px] font-bold leading-snug tracking-wide mb-1">
            {race.raceName}
          </h3>
          <p className="text-white/30 text-[11px] mb-1 leading-relaxed">
            {locality} · {circuitName}
          </p>
          <p className="text-white/40 text-[11px] uppercase tracking-[1px] mb-3">
            {formatDate(race.date)}
          </p>

          {finished ? (
            <p className="text-white/20 text-[9px] uppercase tracking-[2.5px] font-semibold">
              Race complete
            </p>
          ) : (
            <div className="flex gap-1.5 justify-center">
              <CountdownUnit value={days}    label="Days" />
              <CountdownUnit value={hours}   label="Hrs"  />
              <CountdownUnit value={minutes} label="Min"  />
              <CountdownUnit value={seconds} label="Sec"  accent />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Loading / error state ────────────────────────────────────────────────────

function CalendarStatus({ type, message }) {
  return (
    <div
      className="rounded-xl border border-white/[0.08] px-4 py-16 text-center"
      style={{ background: 'rgba(15, 32, 39, 0.6)' }}
    >
      {type === 'loading' ? (
        <p className="text-[11px] font-extrabold uppercase tracking-[4px] text-white/30 animate-pulse">
          Loading calendar...
        </p>
      ) : (
        <>
          <p className="text-[11px] font-extrabold uppercase tracking-[4px] text-white/40 mb-3">
            Unable to load calendar
          </p>
          <p className="text-[12px] text-white/25">{message}</p>
        </>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { data, loading, error } = useStandings(fetchRaceCalendar)
  const [now, setNow] = useState(() => Date.now())

  // Single interval drives all countdowns
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // First race whose start time is still in the future — receives the glow treatment
  const nextRaceRound = data?.races?.find(
    (race) => getRaceDateTime(race).getTime() > now
  )?.round ?? null

  return (
    <div
      className="min-h-svh px-6 pb-14 pt-36 sm:px-12"
      style={{ background: 'linear-gradient(180deg, rgba(15, 32, 39, 1) 40%, rgba(44, 83, 100, 1) 100%)' }}
    >
      <div className="max-w-[1200px] mx-auto">

        {/* Page heading */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[4px] uppercase text-white/40 mb-3">
            <span>🗓</span>
            <span>Formula 1 · {data?.season ? `${data.season} Season` : 'Current Season'}</span>
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-[2px]">
            Race Calendar
          </h1>
        </div>

        {loading && <CalendarStatus type="loading" />}
        {error   && <CalendarStatus type="error" message={error} />}

        {!loading && !error && data?.races && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.races.map((race) => (
              <RaceCard
                key={race.round}
                race={race}
                now={now}
                isNext={race.round === nextRaceRound}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
