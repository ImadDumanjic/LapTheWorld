import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getFlagUrl } from '../components/calendar/countryFlags'

// ─── 2026 F1 Calendar ─────────────────────────────────────────────────────────
const RACES_2026 = [
  { round:  1, name: 'Australian Grand Prix',     country: 'Australia',      city: 'Melbourne',    raceDate: '2026-03-15', slug: 'australia'      },
  { round:  2, name: 'Chinese Grand Prix',         country: 'China',          city: 'Shanghai',     raceDate: '2026-03-22', slug: 'china'          },
  { round:  3, name: 'Japanese Grand Prix',        country: 'Japan',          city: 'Suzuka',       raceDate: '2026-04-19', slug: 'japan'          },
  { round:  4, name: 'Bahrain Grand Prix',         country: 'Bahrain',        city: 'Sakhir',       raceDate: '2026-04-26', slug: 'bahrain'        },
  { round:  5, name: 'Saudi Arabian Grand Prix',   country: 'Saudi Arabia',   city: 'Jeddah',       raceDate: '2026-05-03', slug: 'saudi-arabia'   },
  { round:  6, name: 'Miami Grand Prix',           country: 'USA',            city: 'Miami',        raceDate: '2026-05-10', slug: 'miami'          },
  { round:  7, name: 'Emilia Romagna Grand Prix',  country: 'Italy',          city: 'Imola',        raceDate: '2026-05-24', slug: 'emilia-romagna' },
  { round:  8, name: 'Monaco Grand Prix',          country: 'Monaco',         city: 'Monte Carlo',  raceDate: '2026-06-07', slug: 'monaco'         },
  { round:  9, name: 'Spanish Grand Prix',         country: 'Spain',          city: 'Barcelona',    raceDate: '2026-06-21', slug: 'spain'          },
  { round: 10, name: 'Canadian Grand Prix',        country: 'Canada',         city: 'Montreal',     raceDate: '2026-07-05', slug: 'canada'         },
  { round: 11, name: 'Austrian Grand Prix',        country: 'Austria',        city: 'Spielberg',    raceDate: '2026-07-12', slug: 'austria'        },
  { round: 12, name: 'British Grand Prix',         country: 'United Kingdom', city: 'Silverstone',  raceDate: '2026-07-26', slug: 'silverstone'    },
  { round: 13, name: 'Hungarian Grand Prix',       country: 'Hungary',        city: 'Budapest',     raceDate: '2026-08-02', slug: 'hungary'        },
  { round: 14, name: 'Belgian Grand Prix',         country: 'Belgium',        city: 'Spa',          raceDate: '2026-08-23', slug: 'belgium'        },
  { round: 15, name: 'Dutch Grand Prix',           country: 'Netherlands',    city: 'Zandvoort',    raceDate: '2026-08-30', slug: 'netherlands'    },
  { round: 16, name: 'Italian Grand Prix',         country: 'Italy',          city: 'Monza',        raceDate: '2026-09-06', slug: 'monza'          },
  { round: 17, name: 'Azerbaijan Grand Prix',      country: 'Azerbaijan',     city: 'Baku',         raceDate: '2026-09-20', slug: 'azerbaijan'     },
  { round: 18, name: 'Singapore Grand Prix',       country: 'Singapore',      city: 'Singapore',    raceDate: '2026-10-04', slug: 'singapore'      },
  { round: 19, name: 'United States Grand Prix',   country: 'USA',            city: 'Austin',       raceDate: '2026-10-18', slug: 'usa'            },
  { round: 20, name: 'Mexican Grand Prix',         country: 'Mexico',         city: 'Mexico City',  raceDate: '2026-10-25', slug: 'mexico'         },
  { round: 21, name: 'Brazilian Grand Prix',       country: 'Brazil',         city: 'São Paulo',    raceDate: '2026-11-08', slug: 'brazil'         },
  { round: 22, name: 'Las Vegas Grand Prix',       country: 'USA',            city: 'Las Vegas',    raceDate: '2026-11-22', slug: 'las-vegas'      },
  { round: 23, name: 'Qatar Grand Prix',           country: 'Qatar',          city: 'Lusail',       raceDate: '2026-11-29', slug: 'qatar'          },
  { round: 24, name: 'Abu Dhabi Grand Prix',       country: 'UAE',            city: 'Abu Dhabi',    raceDate: '2026-12-06', slug: 'abu-dhabi'      },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0')

function getWeekendRange(raceDateStr) {
  const race = new Date(`${raceDateStr}T12:00:00Z`)
  const fri  = new Date(race)
  fri.setUTCDate(fri.getUTCDate() - 2)
  const raceDay      = race.getUTCDate()
  const raceMonthStr = race.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
  const raceYear     = race.getUTCFullYear()
  const friDay       = fri.getUTCDate()
  const friMonthStr  = fri.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
  return friMonthStr === raceMonthStr
    ? `${friDay}–${raceDay} ${raceMonthStr} ${raceYear}`
    : `${friDay} ${friMonthStr} – ${raceDay} ${raceMonthStr} ${raceYear}`
}

// ─── Hero circuit decoration ──────────────────────────────────────────────────
function HeroDecoration() {
  return (
    <svg
      viewBox="0 0 1440 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hd-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(77,208,225,0)" />
          <stop offset="12%"  stopColor="rgba(77,208,225,0.28)" />
          <stop offset="88%"  stopColor="rgba(77,208,225,0.28)" />
          <stop offset="100%" stopColor="rgba(77,208,225,0)" />
        </linearGradient>
        <filter id="hd-glow" x="-10%" y="-80%" width="120%" height="260%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer glow for upper track line */}
      <path
        d="M-60 155 C220 90 420 240 680 165 C920 95 1100 250 1340 155 C1390 138 1420 132 1500 128"
        stroke="rgba(77,208,225,0.14)"
        strokeWidth="18"
        fill="none"
        filter="url(#hd-glow)"
      />
      {/* Upper track line */}
      <path
        d="M-60 155 C220 90 420 240 680 165 C920 95 1100 250 1340 155 C1390 138 1420 132 1500 128"
        stroke="url(#hd-fade)"
        strokeWidth="1.6"
        fill="none"
      />

      {/* Outer glow for lower track line */}
      <path
        d="M-60 365 C200 295 420 420 700 345 C940 275 1120 400 1360 325 C1400 312 1430 306 1500 300"
        stroke="rgba(77,208,225,0.09)"
        strokeWidth="14"
        fill="none"
        filter="url(#hd-glow)"
      />
      {/* Lower track line */}
      <path
        d="M-60 365 C200 295 420 420 700 345 C940 275 1120 400 1360 325 C1400 312 1430 306 1500 300"
        stroke="url(#hd-fade)"
        strokeWidth="1.2"
        fill="none"
        opacity="0.5"
      />

      {/* Subtle vertical grid lines */}
      {[180, 360, 540, 720, 900, 1080, 1260].map(x => (
        <line
          key={x}
          x1={x} y1="0" x2={x} y2="520"
          stroke="rgba(77,208,225,0.035)"
          strokeWidth="1"
          strokeDasharray="5 22"
        />
      ))}
    </svg>
  )
}

// ─── Hero section ─────────────────────────────────────────────────────────────
function GridHero() {
  return (
    <section className="relative min-h-[58vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20">

      {/* Diagonal asphalt texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.016) 0px, rgba(255,255,255,0.016) 1px, transparent 1px, transparent 24px)',
        }}
      />

      {/* Radial glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 75% 55% at 50% 58%, rgba(44,83,100,0.22) 0%, transparent 70%)',
        }}
      />

      {/* Circuit SVG */}
      <HeroDecoration />

      {/* Bottom fade into grid section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(15,32,39,0.6) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-[800px] mx-auto">

        {/* Eyebrow */}
        <p
          className="text-[9px] font-extrabold tracking-[6px] uppercase mb-8"
          style={{ color: 'rgba(77,208,225,0.62)' }}
        >
          Formula 1 · 2026 Race Weekend Guide
        </p>

        {/* Main title */}
        <h1
          className="font-black uppercase text-white"
          style={{
            fontSize: 'clamp(50px, 7.5vw, 96px)',
            letterSpacing: '-2px',
            lineHeight: 0.88,
          }}
        >
          <span className="block">Your Grid.</span>
          <span className="block">Your Journey.</span>
        </h1>

        {/* Teal accent underline */}
        <div className="flex justify-center mt-6 mb-7">
          <div
            style={{
              width: 88,
              height: 3,
              background: 'linear-gradient(90deg, transparent 0%, #4DD0E1 38%, #4DD0E1 62%, transparent 100%)',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Subtitle */}
        <p
          className="text-[14px] sm:text-[15px] leading-relaxed mx-auto"
          style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 510 }}
        >
          Every race weekend is a story waiting to be written.
          Choose your Grand Prix and start planning.
        </p>
      </div>
    </section>
  )
}

// ─── Race card ────────────────────────────────────────────────────────────────
function RaceCard({ race, isNext }) {
  const [hovered, setHovered] = useState(false)
  const flagUrl = getFlagUrl(race.country)
  const dateStr = getWeekendRange(race.raceDate)

  const boxShadow = isNext
    ? '0 0 0 1px rgba(77,208,225,0.22), 0 0 32px rgba(77,208,225,0.14), 0 8px 32px rgba(0,0,0,0.5)'
    : hovered
      ? '0 0 0 1px rgba(77,208,225,0.1), 0 12px 36px rgba(0,0,0,0.55), 0 0 22px rgba(77,208,225,0.06)'
      : '0 4px 18px rgba(0,0,0,0.35)'

  return (
    <div
      style={{
        background: 'rgba(13,28,36,0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${isNext ? 'rgba(77,208,225,0.18)' : 'rgba(255,255,255,0.055)'}`,
        borderLeft: `3px solid ${isNext ? '#4DD0E1' : 'rgba(77,208,225,0.42)'}`,
        borderRadius: 12,
        boxShadow,
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 0.28s ease, box-shadow 0.28s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/travel-guide/${race.slug}`} className="block p-5 no-underline">

        {/* Top row: round label + Next Race badge */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[8px] font-extrabold uppercase tracking-[3px]"
            style={{ color: 'rgba(255,255,255,0.26)' }}
          >
            Round {pad(race.round)}
          </span>

          {isNext && (
            <span
              className="text-[7px] font-bold uppercase tracking-[1.5px] px-2 py-0.5 rounded-full"
              style={{
                color: '#4DD0E1',
                border: '1px solid rgba(77,208,225,0.32)',
                background: 'rgba(77,208,225,0.07)',
              }}
            >
              Next Race
            </span>
          )}
        </div>

        {/* Main content: large grid number + race details */}
        <div className="flex items-center gap-4">

          {/* Large position number */}
          <span
            className="font-black tabular-nums leading-none flex-shrink-0 select-none"
            style={{
              fontSize: 'clamp(50px, 4.2vw, 66px)',
              letterSpacing: '-3px',
              lineHeight: 1,
              color: isNext ? 'rgba(77,208,225,0.13)' : 'rgba(255,255,255,0.05)',
              userSelect: 'none',
            }}
          >
            {pad(race.round)}
          </span>

          {/* Race details */}
          <div className="flex-1 min-w-0">

            {/* Country flag + name */}
            <div className="flex items-center gap-2 mb-1.5">
              {flagUrl && (
                <img
                  src={flagUrl}
                  alt={race.country}
                  className="rounded-sm object-cover flex-shrink-0"
                  style={{ height: 13, width: 20, objectPosition: 'center' }}
                />
              )}
              <span
                className="text-[8px] font-bold uppercase tracking-[2px] truncate"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                {race.country}
              </span>
            </div>

            {/* Race name */}
            <h3
              className="font-extrabold uppercase leading-tight truncate"
              style={{
                fontSize: 'clamp(13px, 1.4vw, 16px)',
                letterSpacing: '0.3px',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: 3,
              }}
            >
              {race.name}
            </h3>

            {/* City */}
            <p
              className="text-[10px]"
              style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 2 }}
            >
              {race.city}
            </p>

            {/* Dates */}
            <p
              className="text-[10px] font-semibold"
              style={{ color: isNext ? 'rgba(77,208,225,0.72)' : 'rgba(255,255,255,0.28)' }}
            >
              {dateStr}
            </p>
          </div>
        </div>

        {/* View Guide — slides in on hover */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 11,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(5px)',
            transition: 'opacity 0.22s ease, transform 0.22s ease',
          }}
        >
          <span
            className="text-[9px] font-extrabold uppercase tracking-[2.5px]"
            style={{ color: '#4DD0E1' }}
          >
            View Guide →
          </span>
        </div>
      </Link>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RaceWeekendLandingPage() {
  const now = Date.now()

  // Index of the first race that hasn't started yet (for the Next Race badge only)
  const nextRaceIndex = RACES_2026.findIndex(
    (r) => new Date(`${r.raceDate}T14:00:00Z`).getTime() > now
  )

  // Odd indices → left column (rounds 1,3,5…), even indices → right column (2,4,6…)
  const leftRaces  = RACES_2026.filter((_, i) => i % 2 === 0)
  const rightRaces = RACES_2026.filter((_, i) => i % 2 === 1)

  return (
    <div className="bg-page-gradient min-h-svh">
      <GridHero />

      {/* ── Grid section ── */}
      <div className="px-6 sm:px-12 pb-24 pt-4">
        <div className="max-w-[1200px] mx-auto">

          {/* Section label */}
          <div className="mb-9">
            <p
              className="text-[8px] font-extrabold uppercase tracking-[4px] mb-2"
              style={{ color: 'rgba(77,208,225,0.45)' }}
            >
              2026 Season · {RACES_2026.length} Rounds
            </p>
            <div
              style={{
                width: 36,
                height: 1,
                background: 'rgba(77,208,225,0.28)',
              }}
            />
          </div>

          {/* ── Desktop: two-column staggered grid ── */}
          <div className="hidden md:block relative">

            {/* Dashed center line */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{
                left: '50%',
                width: 1,
                background:
                  'repeating-linear-gradient(to bottom, rgba(77,208,225,0.13) 0px, rgba(77,208,225,0.13) 7px, transparent 7px, transparent 20px)',
              }}
            />

            <div className="flex gap-5">
              {/* Left column — pole positions */}
              <div className="flex-1 flex flex-col gap-5">
                {leftRaces.map((race, i) => (
                  <RaceCard
                    key={race.round}
                    race={race}
                    isNext={i * 2 === nextRaceIndex}
                  />
                ))}
              </div>

              {/* Right column — offset downward to simulate starting grid */}
              <div className="flex-1 flex flex-col gap-5 mt-[88px]">
                {rightRaces.map((race, i) => (
                  <RaceCard
                    key={race.round}
                    race={race}
                    isNext={i * 2 + 1 === nextRaceIndex}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Mobile: single column ── */}
          <div className="flex flex-col gap-4 md:hidden">
            {RACES_2026.map((race, i) => (
              <RaceCard
                key={race.round}
                race={race}
                isNext={i === nextRaceIndex}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
