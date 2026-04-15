import { useParams, Link } from 'react-router-dom'
import { getGuideBySlug } from '../data/travelGuides'
import TravelGuideHero from '../components/travel-guide/TravelGuideHero'
import CircuitInfoSection from '../components/travel-guide/CircuitInfoSection'
import WeatherSection from '../components/travel-guide/WeatherSection'
import WhereToStaySection from '../components/travel-guide/WhereToStaySection'
import RaceWeekendGuideSection from '../components/travel-guide/RaceWeekendGuideSection'

// ── Not-found state ───────────────────────────────────────────────────────────
function NotFound({ slug }) {
  return (
    <div className="bg-page-gradient min-h-svh flex items-center justify-center px-6 sm:px-12">
      <div className="text-center max-w-[420px]">
        <p
          className="text-[10px] font-extrabold tracking-[4px] uppercase mb-5"
          style={{ color: 'rgba(100,168,200,0.6)' }}
        >
          GP Travel Guide
        </p>
        <h1 className="text-4xl font-extrabold uppercase text-white mb-4 tracking-[1px]">
          Guide Not Found
        </h1>
        <p className="text-[14px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.32)' }}>
          No travel guide exists for&nbsp;"<span className="text-white/50">{slug}</span>".
          Check the URL or head back home.
        </p>
        <Link
          to="/landing"
          className="inline-block py-3 px-7 rounded-[50px] text-white text-[11px] font-extrabold uppercase tracking-[2.5px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364, #1a3340)' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(44,83,100,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

// ── TravelGuidePage ───────────────────────────────────────────────────────────
// Route: /travel-guide/:slug
// Reads the slug param, finds the matching guide in travel-guides.json,
// and renders each section in order.
export default function TravelGuidePage() {
  const { slug } = useParams()
  const guide = getGuideBySlug(slug)

  if (!guide) return <NotFound slug={slug ?? ''} />

  return (
    <>
      {/* 1. Hero — full-bleed image, no bg-page-gradient */}
      <TravelGuideHero guide={guide} />

      {/* 2–5. Content sections — all on the shared page gradient */}
      <div className="bg-page-gradient">

        {/* 2. Circuit Info + Weather — side by side */}
        <div className="px-6 sm:px-12 pt-14 pb-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <CircuitInfoSection guide={guide} />
              <WeatherSection guide={guide} />
            </div>
          </div>
        </div>

        {/* 3. Where to Stay — full-width map placeholder */}
        <div className="px-6 sm:px-12 py-10">
          <div className="max-w-[1200px] mx-auto">
            <WhereToStaySection guide={guide} />
          </div>
        </div>

        {/* 4. Race Weekend Guide — featured + stacked cards */}
        <div className="px-6 sm:px-12 pt-6 pb-24">
          <div className="max-w-[1200px] mx-auto">
            <RaceWeekendGuideSection guide={guide} />
          </div>
        </div>

      </div>
    </>
  )
}
