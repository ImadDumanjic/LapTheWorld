import useWeather from '../../hooks/useWeather'
import { RACE_DATES } from '../../data/calendar'

// ── Shared card title spec — must match CircuitInfoSection token-for-token ────
const CARD_TITLE = {
  fontSize:      18,
  fontWeight:    700,
  letterSpacing: '2.5px',
  lineHeight:    1,
  color:         '#fff',
  textTransform: 'uppercase',
}

// Shared gradient divider — brighter on the left, fades right
function CardDivider() {
  return (
    <div
      style={{
        height: 1,
        borderRadius: 1,
        background:
          'linear-gradient(to right, rgba(77,208,225,0.55), rgba(44,83,100,0.25) 55%, transparent)',
      }}
    />
  )
}

// ── Weather icons ─────────────────────────────────────────────────────────────
function WeatherIcon({ type }) {
  const base = {
    width: 26,
    height: 26,
    viewBox: '0 0 24 24',
    fill: 'none',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (type === 'sunny') return (
    <svg {...base} stroke="rgba(255,200,75,0.92)" style={{ filter: 'drop-shadow(0 0 6px rgba(255,200,75,0.35))' }}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )

  if (type === 'rainy') return (
    <svg {...base} stroke="rgba(100,165,220,0.9)" style={{ filter: 'drop-shadow(0 0 5px rgba(100,165,220,0.3))' }}>
      <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
      <line x1="8" y1="19" x2="8" y2="21" />
      <line x1="8" y1="13" x2="8" y2="15" />
      <line x1="16" y1="19" x2="16" y2="21" />
      <line x1="16" y1="13" x2="16" y2="15" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="12" y1="15" x2="12" y2="17" />
    </svg>
  )

  // partly-cloudy | cloudy | fallback
  return (
    <svg {...base} stroke="rgba(148,188,220,0.85)" style={{ filter: 'drop-shadow(0 0 5px rgba(148,188,220,0.25))' }}>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  )
}

// ── Forecast row ──────────────────────────────────────────────────────────────
function ForecastRow({ day, isLast }) {
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <WeatherIcon type={day.icon} />
        <div className="min-w-0">
          <p
            className="text-[9px] font-extrabold tracking-[2px] uppercase mb-1"
            style={{ color: 'rgba(255,255,255,0.28)' }}
          >
            {day.label}
          </p>
          <p className="text-[14px] font-bold text-white truncate">{day.condition}</p>
        </div>
      </div>
      <div className="flex-shrink-0 pl-4 text-right">
        <span
          className="text-[20px] font-bold text-white"
          style={{ textShadow: '0 0 20px rgba(77,208,225,0.18)' }}
        >
          {day.high}°
        </span>
        <span className="text-[13px] ml-1.5 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>
          / {day.low}°
        </span>
      </div>
    </div>
  )
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow({ isLast }) {
  return (
    <div
      className="py-4"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="h-11 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  )
}

// ── Placeholder forecast row (unavailable state) ──────────────────────────────
// Mimics the real row layout so the card doesn't feel hollow.
function PlaceholderRow({ isLast }) {
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center gap-3.5 flex-1">
        {/* Icon ghost */}
        <div
          className="rounded-full flex-shrink-0"
          style={{ width: 26, height: 26, background: 'rgba(44,83,100,0.18)' }}
        />
        <div className="flex flex-col gap-1.5">
          <div className="h-2 w-16 rounded" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <div className="h-3.5 w-24 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>
      <div className="flex-shrink-0 pl-4">
        <div className="h-5 w-14 rounded" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>
    </div>
  )
}

// ── WeatherSection ────────────────────────────────────────────────────────────
export default function WeatherSection({ guide }) {
  const { coordinates, weather, slug } = guide
  const raceDate = RACE_DATES[slug] ?? null
  const { status, data } = useWeather({
    lat: coordinates?.lat,
    lng: coordinates?.lng,
    raceDate,
  })

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col gap-8"
      style={{
        padding: '32px 36px',
        background: 'rgba(10, 22, 31, 0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: '2px solid rgba(44,83,100,0.6)',
        boxShadow:
          '0 0 0 1px rgba(44,83,100,0.15), 0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Inner radial glow — top-left teal ambient */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: 260,
          height: 200,
          background:
            'radial-gradient(ellipse at top left, rgba(44,83,100,0.22) 0%, transparent 70%)',
        }}
      />

      {/* Title */}
      <div className="relative z-10 flex flex-col gap-4">
        <h2 style={CARD_TITLE}>Race Weekend Forecast</h2>
        <CardDivider />
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div className="relative z-10">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow isLast />
        </div>
      )}

      {/* Ready — real forecast data */}
      {status === 'ready' && data?.days && (
        <div className="relative z-10">
          {data.days.map((day, i) => (
            <ForecastRow key={i} day={day} isLast={i === data.days.length - 1} />
          ))}
        </div>
      )}

      {/* Unavailable / error */}
      {(status === 'unavailable' || status === 'error') && (
        <div className="relative z-10">
          <PlaceholderRow />
          <PlaceholderRow />
          <PlaceholderRow isLast />

          <div className="mt-5 flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(44,83,100,0.2)',
                border: '1px solid rgba(44,83,100,0.32)',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(100,168,200,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
            </div>
            <div>
              {weather?.location && (
                <p className="text-[11px] font-semibold text-white/30 leading-none mb-0.5">
                  {weather.location}
                </p>
              )}
              <p className="text-[10px] font-extrabold tracking-[2.5px] uppercase" style={{ color: 'rgba(100,168,200,0.42)' }}>
                {status === 'error'
                  ? 'Forecast temporarily unavailable'
                  : data?.reason === 'past'
                    ? 'Race weekend has passed'
                    : data?.reason === 'too-early'
                      ? `Forecast available from ${data.availableFrom}`
                      : 'Forecast unavailable'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
