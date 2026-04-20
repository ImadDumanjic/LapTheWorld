import { Map, MapMarker, MapPopup, MapTileLayer, MapZoomControl } from '@/components/ui/map'

// Marker + popup styles injected as a <style> tag so they survive renderToString serialization.
// CSS hover rules work without JS event handlers on the serialized HTML.
// Leaflet popup overrides use !important to win over leaflet.css and Tailwind bg-popover.
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

  .ltw-hotel-pin {
    transition: transform 220ms ease, filter 220ms ease;
    cursor: pointer;
  }
  .ltw-hotel-pin:hover {
    transform: scale(1.2);
    filter: drop-shadow(0 0 10px rgba(255,180,50,0.65));
  }

  /* Outer popup container — bg-popover from MapPopup applies here, must be transparent */
  .leaflet-popup {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }
  .leaflet-popup-content-wrapper {
    background: rgba(8,18,28,0.97) !important;
    border: 1px solid rgba(255,255,255,0.10) !important;
    border-radius: 10px !important;
    box-shadow: 0 8px 28px rgba(0,0,0,0.65) !important;
    padding: 0 !important;
    color: inherit !important;
  }
  .leaflet-popup-content {
    margin: 12px 14px !important;
    width: auto !important;
  }
  .leaflet-popup-tip-container {
    overflow: visible !important;
  }
  .leaflet-popup-tip {
    background: rgba(8,18,28,0.97) !important;
    box-shadow: none !important;
  }
  .leaflet-popup-close-button {
    color: rgba(255,255,255,0.28) !important;
    font-size: 18px !important;
    line-height: 22px !important;
    right: 6px !important;
    top: 4px !important;
    padding: 0 !important;
  }
  .leaflet-popup-close-button:hover {
    color: rgba(255,255,255,0.70) !important;
    background: transparent !important;
  }
`

// ── Circuit marker — teal glow, racing flag icon ─────────────────────────────
function CircuitPin() {
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
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      </div>
    </div>
  )
}

// ── Hotel marker — amber glow, bed icon ───────────────────────────────────────
function HotelPin() {
  return (
    <div
      className="ltw-hotel-pin"
      style={{
        width: 30,
        height: 30,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(255,180,50,0.18) 0%, transparent 72%)',
        boxShadow: '0 0 0 1.5px rgba(255,180,50,0.30), 0 0 14px rgba(255,180,50,0.32)',
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(8,20,30,0.92)',
          border: '1.5px solid rgba(255,180,50,0.52)',
          boxShadow: 'inset 0 1px 0 rgba(255,200,80,0.10)',
        }}
      >
        {/* Bed icon */}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,180,50,0.88)"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 19V9a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v10" />
          <path d="M3 15h18" />
          <path d="M7 8V5h10v3" />
        </svg>
      </div>
    </div>
  )
}

// ── Map with circuit + hotel markers ─────────────────────────────────────────
function LiveMap({ coordinates, city, country, hotels }) {
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

        {/* Circuit / area marker */}
        <MapMarker
          position={[lat, lng]}
          icon={<CircuitPin />}
          iconAnchor={[18, 18]}
        />

        {/* Hotel markers — one per entry in hotels[], popup on click */}
        {hotels.map(hotel => (
          <MapMarker
            key={`${hotel.lat},${hotel.lng}`}
            position={[hotel.lat, hotel.lng]}
            icon={<HotelPin />}
            iconAnchor={[15, 15]}
            popupAnchor={[0, -15]}
          >
            <MapPopup minWidth={180} maxWidth={220}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.88)', marginBottom: 4, lineHeight: 1.3 }}>
                {hotel.name}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.42)', lineHeight: 1.45, margin: 0 }}>
                {hotel.address}
              </p>
            </MapPopup>
          </MapMarker>
        ))}
      </Map>

      {/* City label chip */}
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
      <LiveMap
        coordinates={guide.coordinates}
        city={guide.city}
        country={guide.country}
        hotels={guide.hotels ?? []}
      />
    </section>
  )
}
