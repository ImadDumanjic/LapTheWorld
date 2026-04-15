// ── Shared card title spec — must match WeatherSection token-for-token ────────
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

// ── Subtle racing-line decoration ─────────────────────────────────────────────
// Two thin parallel curves evoking a circuit track section.
// Opacity kept at 9% so it never fights the text.
function RacingLineDecoration() {
  return (
    <svg
      className="absolute bottom-0 right-0 pointer-events-none select-none"
      width="230"
      height="190"
      viewBox="0 0 230 190"
      fill="none"
      aria-hidden="true"
      style={{ opacity: 0.09 }}
    >
      {/* Outer edge of track */}
      <path
        d="M225 175 C205 162 182 138 160 112 C138 86 122 54 96 38 C70 22 38 28 22 50 C6 70 12 100 2 122"
        stroke="rgba(77,208,225,1)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Inner edge of track — offset inward ~12px */}
      <path
        d="M212 178 C193 165 172 142 151 117 C130 92 115 61 90 46 C65 31 36 37 21 59 C7 78 13 107 4 128"
        stroke="rgba(77,208,225,1)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

// ── Stat text-shadow glow ─────────────────────────────────────────────────────
const NUM_GLOW = {
  textShadow: '0 0 24px rgba(77,208,225,0.22), 0 0 60px rgba(77,208,225,0.08)',
}

// ── Stat block ────────────────────────────────────────────────────────────────
function StatBlock({ label, value, valueSize = 30 }) {
  return (
    <div>
      <p
        className="text-[9px] font-extrabold tracking-[3px] uppercase mb-2"
        style={{ color: 'rgba(100,168,200,0.5)' }}
      >
        {label}
      </p>
      <p
        className="font-bold text-white leading-none"
        style={{ fontSize: valueSize, letterSpacing: '-0.5px', ...NUM_GLOW }}
      >
        {value ?? '—'}
      </p>
    </div>
  )
}

// ── CircuitInfoSection ────────────────────────────────────────────────────────
export default function CircuitInfoSection({ guide }) {
  const { circuit, circuitInfo } = guide
  const { laps, length_km, drs_zones, first_gp } = circuitInfo ?? {}

  // 3.337 → "3,337"  (European decimal-comma matching screenshots)
  const lengthNum =
    length_km != null ? length_km.toFixed(3).replace('.', ',') : '—'

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col gap-7"
      style={{
        padding: '32px 36px',
        background: 'rgba(10, 22, 31, 0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: '2px solid rgba(44,83,100,0.6)',
        boxShadow:
          '0 0 0 1px rgba(44,83,100,0.15), 0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Top-left radial ambient */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: 260,
          height: 200,
          background:
            'radial-gradient(ellipse at top left, rgba(44,83,100,0.22) 0%, transparent 70%)',
        }}
      />

      {/* Racing-line background decoration */}
      <RacingLineDecoration />

      {/* Title */}
      <div className="relative z-10 flex flex-col gap-4">
        <h2 style={CARD_TITLE}>{circuit ?? 'Circuit Info'}</h2>
        <CardDivider />
      </div>

      {/* Stats — 2-column grid */}
      <div className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-8">

        <StatBlock label="Laps" value={laps} valueSize={32} />

        {/* Circuit length — inline "km" unit */}
        <div>
          <p
            className="text-[9px] font-extrabold tracking-[3px] uppercase mb-2"
            style={{ color: 'rgba(100,168,200,0.5)' }}
          >
            Circuit Length
          </p>
          <p
            className="font-bold text-white leading-none"
            style={{ fontSize: 32, letterSpacing: '-0.5px', ...NUM_GLOW }}
          >
            {lengthNum}
            <span
              className="ml-2 font-semibold"
              style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', letterSpacing: 0 }}
            >
              km
            </span>
          </p>
        </div>

        <StatBlock label="DRS Zones" value={drs_zones} valueSize={32} />

        <StatBlock label="First GP" value={first_gp} valueSize={32} />

      </div>
    </div>
  )
}
