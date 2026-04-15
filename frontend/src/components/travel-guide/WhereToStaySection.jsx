// ── Map placeholder ───────────────────────────────────────────────────────────
// Dark map aesthetic with road lines and teal markers.
// Replace with Mapbox GL / Leaflet (dark tile) when ready.

function MapPlaceholder({ city, country }) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        height: 260,
        background: 'linear-gradient(135deg, #0a1c26 0%, #0d2230 50%, #081820 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Grid: fine mesh */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none select-none" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <pattern id="grid-fine" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.028)" strokeWidth="0.7" />
          </pattern>
          <pattern id="grid-coarse" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-fine)" />
        <rect width="100%" height="100%" fill="url(#grid-coarse)" />
      </svg>

      {/* Road lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        aria-hidden="true"
        viewBox="0 0 900 260"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Main roads — thicker */}
        <path d="M0 155 Q180 125 320 145 Q460 165 580 130 Q700 95 900 108" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" fill="none" />
        <path d="M0 80 Q150 65 300 85 Q500 110 680 75 Q800 55 900 60" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" fill="none" />
        {/* Secondary roads */}
        <path d="M0 200 Q200 185 380 198 Q560 212 900 188" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" fill="none" />
        <path d="M260 0 Q280 60 260 130 Q240 200 270 260" stroke="rgba(255,255,255,0.055)" strokeWidth="1.5" fill="none" />
        <path d="M550 0 Q540 70 560 140 Q575 200 555 260" stroke="rgba(255,255,255,0.045)" strokeWidth="1.2" fill="none" />
        <path d="M750 0 Q760 80 740 160 Q730 220 755 260" stroke="rgba(255,255,255,0.04)" strokeWidth="1.2" fill="none" />
        {/* Curved local roads */}
        <path d="M80 0 Q100 50 85 100 Q65 160 90 210 Q105 235 95 260" stroke="rgba(255,255,255,0.038)" strokeWidth="1" fill="none" />
        <path d="M0 35 Q120 42 240 32 Q360 22 480 38 Q600 54 720 44 Q820 36 900 40" stroke="rgba(255,255,255,0.048)" strokeWidth="1" fill="none" />
      </svg>

      {/* Teal pin markers */}
      {[
        { x: '22%', y: '42%' },
        { x: '38%', y: '28%' },
        { x: '51%', y: '55%' },
        { x: '67%', y: '35%' },
        { x: '18%', y: '65%' },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -50%)' }}
        >
          <div
            className="rounded-full"
            style={{
              width: 12,
              height: 12,
              background: 'rgba(77,208,225,0.88)',
              boxShadow: '0 0 0 3px rgba(77,208,225,0.18), 0 0 12px rgba(77,208,225,0.4)',
            }}
          />
        </div>
      ))}

      {/* Zoom controls (decorative) */}
      <div
        className="absolute bottom-3 right-3 flex flex-col rounded-lg overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,24,33,0.9)' }}
      >
        {['+', '−'].map((label, i) => (
          <div
            key={label}
            className="flex items-center justify-center select-none"
            style={{
              width: 26,
              height: 26,
              fontSize: 15,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.38)',
              borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* City label chip */}
      <div
        className="absolute top-3 left-3 px-3 py-1.5 rounded-lg"
        style={{ background: 'rgba(10,22,30,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-[9px] font-extrabold tracking-[2.5px] uppercase" style={{ color: 'rgba(100,168,200,0.62)' }}>
          {city}, {country}
        </p>
      </div>

      {/* Coming soon label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <p className="text-[9px] font-extrabold tracking-[2.5px] uppercase whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Interactive map · coming soon
        </p>
      </div>
    </div>
  )
}

// ── Section title ─────────────────────────────────────────────────────────────
function SectionTitle({ title }) {
  return (
    <div className="mb-6">
      <h2 className="text-[28px] sm:text-[32px] font-extrabold uppercase text-white tracking-[2px]" style={{ lineHeight: 1 }}>
        {title}
      </h2>
      <div
        className="mt-3"
        style={{ width: 52, height: 2, borderRadius: 2, background: 'linear-gradient(to right, rgba(44,83,100,0.9), rgba(44,83,100,0.1))' }}
      />
    </div>
  )
}

// ── WhereToStaySection ────────────────────────────────────────────────────────
export default function WhereToStaySection({ guide }) {
  return (
    <section>
      <SectionTitle title="Where to Stay" />
      <MapPlaceholder city={guide.city} country={guide.country} />
    </section>
  )
}
