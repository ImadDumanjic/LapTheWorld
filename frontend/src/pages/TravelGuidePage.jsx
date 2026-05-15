import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchGuideBySlug } from '../services/guideService'
import { useAudio } from '../context/AudioContext'
import TravelGuideHero from '../components/travel-guide/TravelGuideHero'
import CircuitInfoSection from '../components/travel-guide/CircuitInfoSection'
import WeatherSection from '../components/travel-guide/WeatherSection'
import WhereToStaySection from '../components/travel-guide/WhereToStaySection'
import RaceWeekendGuideSection from '../components/travel-guide/RaceWeekendGuideSection'
import FloatingButtonGroup from '../components/travel-guide/FloatingButtonGroup'
import LegalFooter from '../components/ui/LegalFooter'

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

function LoadingState() {
  return (
    <div className="bg-page-gradient min-h-svh flex items-center justify-center">
      <div
        className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: 'rgba(100,168,200,0.7)' }}
      />
    </div>
  )
}

export default function TravelGuidePage() {
  const { slug } = useParams()
  const { loadCircuit, stopCurrent } = useAudio()

  const [guide, setGuide]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    setGuide(null)

    fetchGuideBySlug(slug)
      .then(data => {
        if (cancelled) return
        if (!data) { setNotFound(true) } else { setGuide(data) }
      })
      .catch(() => { if (!cancelled) setNotFound(true) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    if (!guide) return
    loadCircuit(slug)
    return () => stopCurrent()
  }, [slug, guide, loadCircuit, stopCurrent])

  if (loading)  return <LoadingState />
  if (notFound) return <NotFound slug={slug ?? ''} />

  return (
    <>
      <TravelGuideHero guide={guide} />
      <FloatingButtonGroup guide={guide} />

      <div className="bg-page-gradient">
        <div className="px-6 sm:px-12 pt-14 pb-10">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <CircuitInfoSection guide={guide} />
              <WeatherSection guide={guide} />
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-12 py-10">
          <div className="max-w-[1200px] mx-auto">
            <WhereToStaySection guide={guide} />
          </div>
        </div>

        <div className="px-6 sm:px-12 pt-6 pb-24">
          <div className="max-w-[1200px] mx-auto">
            <RaceWeekendGuideSection guide={guide} />
          </div>
        </div>
        <LegalFooter />
      </div>
    </>
  )
}
