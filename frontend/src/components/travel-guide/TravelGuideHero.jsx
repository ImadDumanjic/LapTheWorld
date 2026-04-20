import travelGuideImage   from '../../assets/TravelGuideGrandPrix.png'
import monacoHero         from '../../assets/MonacoHero.png'
import canadaHero         from '../../assets/CanadaHero.png'
import belgiumHero        from '../../assets/BelgiumHero.png'
import azerbaijanHero     from '../../assets/AzerbaijanHero.png'
import singaporeHero      from '../../assets/SingaporeHero.png'
import italyHero          from '../../assets/ItalyHero.png'
import lasVegasHero       from '../../assets/LasVegasHero.png'
import austinHero         from '../../assets/AustinHero.png'
import brazilHero         from '../../assets/BrazilHero.png'
import abuDhabiHero       from '../../assets/AbuDhabiHero.png'
import { getFlagUrl } from '../calendar/countryFlags'

const HERO_IMAGES = {
  monaco:     monacoHero,
  canada:     canadaHero,
  belgium:    belgiumHero,
  azerbaijan: azerbaijanHero,
  singapore:  singaporeHero,
  italy:      italyHero,
  'las-vegas': lasVegasHero,
  usa:        austinHero,
  brazil:     brazilHero,
  uae:        abuDhabiHero,
}

// ── Sine-wave circuit decoration ──────────────────────────────────────────────
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

// ── Scroll indicator ──────────────────────────────────────────────────────────
function ScrollIndicator() {
  return (
    <div
      className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Label */}
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '6px',
          textTransform: 'uppercase',
          color: 'rgba(180,220,235,0.7)',
        }}
      >
        SCROLL
      </span>

      {/* Glowing vertical line — layered for the halo effect */}
      <div style={{ position: 'relative', width: 8, height: 36 }}>
        {/* Outer halo (wide + blurred) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 6,
            height: '100%',
            background:
              'linear-gradient(to bottom, rgba(77,188,212,0.45) 0%, rgba(44,83,100,0.1) 80%, transparent 100%)',
            filter: 'blur(4px)',
            borderRadius: 4,
          }}
        />
        {/* Core line (sharp + bright) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1,
            height: '100%',
            background:
              'linear-gradient(to bottom, rgba(120,210,230,0.9) 0%, rgba(77,188,212,0.4) 65%, transparent 100%)',
          }}
        />
      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function TravelGuideHero({ guide }) {
  const { title, city, country, circuit, slug } = guide
  const heroImage = HERO_IMAGES[slug]

  const flagUrl = getFlagUrl(country)

  const gpIndex  = title.lastIndexOf(' Grand Prix')
  const raceName = gpIndex !== -1 ? title.slice(0, gpIndex) : title
  const suffix   = gpIndex !== -1 ? 'Grand Prix' : ''

  return (
    <div className="relative min-h-[94vh] flex flex-col justify-end overflow-hidden">

      {/* Background image */}
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        style={{ filter: 'brightness(0.5)' }}
      />

      {/* Radial vignette — adds depth, darkens edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(6,14,20,0.48) 100%)',
        }}
      />

      {/* Left content gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(15,32,39,0.97) 0%, rgba(15,32,39,0.88) 20%, rgba(15,32,39,0.65) 42%, rgba(15,32,39,0.22) 65%, transparent 100%)',
        }}
      />

      {/* Bottom fade — deep, multi-stop for a smooth transition into the page */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(15,32,39,1) 0%, rgba(15,32,39,0.92) 7%, rgba(15,32,39,0.72) 16%, rgba(15,32,39,0.38) 28%, rgba(15,32,39,0.1) 42%, transparent 56%)',
        }}
      />

      {/* Top fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(15,32,39,0.65) 0%, transparent 18%)' }}
      />

      {/* Sine-wave decoration */}
      <CircuitDecoration />

      {/* Scroll indicator */}
      <ScrollIndicator />

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
                <span
                  className="inline-block rounded-sm flex-shrink-0"
                  style={{ width: 26, height: 16, background: 'rgba(44,83,100,0.5)' }}
                />
              )}
              <span
                className="text-[10px] font-extrabold tracking-[3.5px] uppercase"
                style={{ color: 'rgba(100,168,200,0.72)' }}
              >
                {city} · {country}
              </span>
            </div>

            {/* Race title */}
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
