import travelGuideImage from '../../assets/TravelGuideGrandPrix.png'
import { getFlagUrl } from '../calendar/countryFlags'

// ── Sine-wave circuit decoration ──────────────────────────────────────────────
// Full-width S-curve spanning the hero, matching the screenshot visual.
function CircuitDecoration() {
  return (
    <svg
      viewBox="0 0 1440 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="wave-glow" x="-5%" y="-80%" width="110%" height="260%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="wave-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="rgba(77,208,225,0)" />
          <stop offset="6%"   stopColor="rgba(77,208,225,0.85)" />
          <stop offset="94%"  stopColor="rgba(77,208,225,0.85)" />
          <stop offset="100%" stopColor="rgba(77,208,225,0)" />
        </linearGradient>
      </defs>

      {/* Outer glow layer */}
      <path
        d="M-60 310 C120 160 280 460 480 310 C680 160 840 460 1040 310 C1200 190 1340 280 1500 260"
        stroke="rgba(77,208,225,0.22)"
        strokeWidth="20"
        fill="none"
        filter="url(#wave-glow)"
      />
      {/* Primary line */}
      <path
        d="M-60 310 C120 160 280 460 480 310 C680 160 840 460 1040 310 C1200 190 1340 280 1500 260"
        stroke="url(#wave-fade)"
        strokeWidth="2.2"
        fill="none"
      />
    </svg>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function TravelGuideHero({ guide }) {
  const { title, city, country, circuit } = guide

  const flagUrl = getFlagUrl(country)

  // "Monaco Grand Prix" → raceName="Monaco", suffix="Grand Prix"
  const gpIndex  = title.lastIndexOf(' Grand Prix')
  const raceName = gpIndex !== -1 ? title.slice(0, gpIndex) : title
  const suffix   = gpIndex !== -1 ? 'Grand Prix' : ''

  return (
    <div className="relative min-h-[94vh] flex flex-col justify-end overflow-hidden">

      {/* Background image */}
      <img
        src={travelGuideImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        style={{ filter: 'brightness(0.5)' }}
      />

      {/* Left content gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(15,32,39,0.97) 0%, rgba(15,32,39,0.88) 20%, rgba(15,32,39,0.65) 42%, rgba(15,32,39,0.22) 65%, transparent 100%)',
        }}
      />
      {/* Bottom fade into sections — slightly deeper for a smoother blend */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(15,32,39,1) 0%, rgba(15,32,39,0.75) 18%, rgba(15,32,39,0.15) 38%, transparent 52%)',
        }}
      />
      {/* Top fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(15,32,39,0.65) 0%, transparent 18%)' }}
      />

      {/* Sine-wave decoration — full width overlay */}
      <CircuitDecoration />

      {/* Scroll indicator — centered at very bottom */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none select-none"
        style={{ gap: 8 }}
      >
        <span
          className="font-extrabold uppercase"
          style={{ fontSize: 9, letterSpacing: '4.5px', color: 'rgba(255,255,255,0.20)' }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 46,
            background: 'linear-gradient(to bottom, rgba(77,208,225,0.50) 0%, rgba(77,208,225,0.10) 55%, transparent 100%)',
          }}
        />
      </div>

      {/* Content — pinned to bottom-left */}
      <div className="relative z-10 w-full px-6 sm:px-12 pb-16 sm:pb-20 pt-28">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-[560px]">

            {/* Location chip */}
            <div className="flex items-center gap-3 mb-5">
              {flagUrl ? (
                <img
                  src={flagUrl}
                  alt={country}
                  className="rounded-sm object-cover flex-shrink-0"
                  style={{ height: 16, width: 26, objectPosition: 'center' }}
                />
              ) : (
                <span className="inline-block rounded-sm flex-shrink-0" style={{ width: 26, height: 16, background: 'rgba(44,83,100,0.5)' }} />
              )}
              <span className="text-[10px] font-extrabold tracking-[3.5px] uppercase" style={{ color: 'rgba(100,168,200,0.72)' }}>
                {city} · {country}
              </span>
            </div>

            {/* Race title — large, bottom-anchored */}
            <h1
              className="font-extrabold uppercase leading-none"
              style={{ fontSize: 'clamp(58px, 9.5vw, 118px)', letterSpacing: '-1px', lineHeight: 0.87 }}
            >
              <span className="block text-white">{raceName.toUpperCase()}</span>
              {suffix && (
                <span
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, #5ab3d4 0%, #2C5364 58%, #7dcae3 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {suffix.toUpperCase()}
                </span>
              )}
            </h1>

            {/* Circuit name */}
            <p
              className="text-[10px] font-extrabold tracking-[3px] uppercase mt-5"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              {circuit}
            </p>

          </div>
        </div>
      </div>

    </div>
  )
}
