import { Map, MapMarker, MapTileLayer, MapZoomControl } from '@/components/ui/map'

// Marker styles — injected as a <style> tag so they survive renderToString serialization.
// The hover rule uses CSS so it works without JS event handlers on the serialized HTML.
const markerStyles = `
  .leaflet-div-icon { background: none !important; border: none !important; }
  .ltw-pin {
    transition: transform 220ms ease, filter 220ms ease;
    cursor: pointer;
  }
  .ltw-pin:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 0 10px rgba(77,208,225,0.7));
  }
`

// Premium accommodation marker — outer glow ring → dark inner circle → house icon.
// Uses className so the CSS hover rule above applies after renderToString serialization.
function AccommodationPin() {
  return (
    <div
      className="ltw-pin"
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(77,208,225,0.16) 0%, transparent 72%)',
        boxShadow: '0 0 0 1.5px rgba(77,208,225,0.24), 0 0 20px rgba(77,208,225,0.42)',
      }}
    >
      {/* Inner circle */}
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(8,20,30,0.92)',
          border: '1.5px solid rgba(77,208,225,0.52)',
          boxShadow: 'inset 0 1px 0 rgba(100,200,220,0.1)',
        }}
      >
        {/* House / accommodation icon */}
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(120,220,235,0.92)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
    </div>
  )
}

// ── Live dark map ─────────────────────────────────────────────────────────────
function LiveMap({ coordinates, city, country }) {
  const { lat, lng } = coordinates
  const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        height: 260,
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <style>{markerStyles}</style>

      <Map
        center={[lat, lng]}
        zoom={14}
        style={{ height: '100%', minHeight: 0 }}
        className="rounded-2xl"
      >
        <MapTileLayer url={DARK_TILES} />
        <MapZoomControl position="bottom-3 right-3" />
        <MapMarker
          position={[lat, lng]}
          icon={<AccommodationPin />}
          iconAnchor={[18, 18]}
        />
      </Map>

      {/* City label chip — same position and style as the old placeholder */}
      <div
        className="absolute top-3 left-3 px-3 py-1.5 rounded-lg z-[1000]"
        style={{ background: 'rgba(10,22,30,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <p className="text-[9px] font-extrabold tracking-[2.5px] uppercase" style={{ color: 'rgba(100,168,200,0.62)' }}>
          {city}, {country}
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
      <LiveMap coordinates={guide.coordinates} city={guide.city} country={guide.country} />
    </section>
  )
}
