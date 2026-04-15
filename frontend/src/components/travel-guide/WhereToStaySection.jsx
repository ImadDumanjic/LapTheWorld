import {
  Map,
  MapMarker,
  MapTileLayer,
  MapZoomControl,
} from '@/components/ui/map'

// CartoDB Dark Matter — free, no API key required
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'

// Teal dot marker that matches the brand colour palette
function TealDot() {
  return (
    <div
      style={{
        width: 14,
        height: 14,
        background: 'rgba(77,208,225,0.9)',
        borderRadius: '50%',
        boxShadow:
          '0 0 0 4px rgba(77,208,225,0.18), 0 0 14px rgba(77,208,225,0.45)',
      }}
    />
  )
}

// ── Section title ─────────────────────────────────────────────────────────────
function SectionTitle({ title }) {
  return (
    <div className="mb-6">
      <h2
        className="text-[28px] sm:text-[32px] font-extrabold uppercase text-white tracking-[2px]"
        style={{ lineHeight: 1 }}
      >
        {title}
      </h2>
      <div
        className="mt-3"
        style={{
          width: 52,
          height: 2,
          borderRadius: 2,
          background:
            'linear-gradient(to right, rgba(44,83,100,0.9), rgba(44,83,100,0.1))',
        }}
      />
    </div>
  )
}

// ── WhereToStaySection ────────────────────────────────────────────────────────
export default function WhereToStaySection({ guide }) {
  const { lat, lng } = guide.coordinates

  return (
    <section>
      <SectionTitle title="Where to Stay" />

      {/* Map container — fixed height, clips Leaflet canvas to rounded corners */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          height: 380,
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* City badge — z-[1001] sits above Leaflet tile layers (z-index 200–400) */}
        <div
          className="absolute top-3 left-3 z-[1001] px-3 py-1.5 rounded-lg pointer-events-none"
          style={{
            background: 'rgba(10,22,30,0.85)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p
            className="text-[9px] font-extrabold tracking-[2.5px] uppercase"
            style={{ color: 'rgba(100,168,200,0.62)' }}
          >
            {guide.city}, {guide.country}
          </p>
        </div>

        {/*
          min-h-0 overrides the default min-h-96 on Map so it fills the
          260 px parent instead of expanding to 384 px.
          url= forces dark tiles without needing a ThemeProvider.
        */}
        <Map
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          className="min-h-0"
        >
          <MapTileLayer url={DARK_TILE_URL} />
          <MapZoomControl position="bottom-3 right-3" />
          <MapMarker
            position={[lat, lng]}
            icon={<TealDot />}
            iconAnchor={[7, 7]}
          />
        </Map>
      </div>
    </section>
  )
}
