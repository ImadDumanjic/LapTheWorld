import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import blog from '../../assets/Blog.png'
import calendar from '../../assets/Calendar.png'
import standings from '../../assets/Standings.png'
import liveTiming from '../../assets/LiveTiming.png'
import travelGuide from '../../assets/TravelGuideGrandPrix.png'
import AuthRequiredModal from '../ui/AuthRequiredModal'

const CARDS = [
  {
    id: 1,
    image: blog,
    title: 'Share Your Race Weekend Story',
    subtitle: 'Blog Section',
    align: 'left',
    to: '/blog',
  },
  {
    id: 2,
    image: calendar,
    title: 'One Season. One Journey.',
    subtitle: 'Global calendar',
    align: 'right',
    to: '/calendar',
  },
  {
    id: 3,
    image: standings,
    title: 'Every Point. Every Team. Every Driver.',
    subtitle: 'Championship Standings',
    align: 'left',
    to: '/championship',
  },
  {
    id: 4,
    image: liveTiming,
    title: 'The Action, As It Happens',
    subtitle: 'Live Timing',
    align: 'right',
    to: '/live-timing',
  },
  {
    id: 5,
    image: travelGuide,
    title: 'Everything You Need. One Place.',
    subtitle: 'Grand Prix Travel Guide',
    align: 'left',
    to: '/travel-guide',
  },
]

function ImageCard({ image, title, subtitle, align = 'left', className = '', to, onClick }) {
  const inner = (
    <div className={`relative overflow-hidden rounded-xl group cursor-pointer ${className}`}>
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 20%, rgba(0,0,0,0.3) 40%, transparent 60%)' }}
      />
      <div
        className={`absolute bottom-0 z-10 pb-4 ${
          align === 'right' ? 'right-0 pr-4 text-right' : 'left-0 pl-4 text-left'
        }`}
      >
        <p className="text-white/45 text-[9px] uppercase tracking-[3px] mb-[3px] font-semibold">
          {subtitle}
        </p>
        <h3 className="text-white text-[13px] font-bold leading-snug tracking-wide">
          {title}
        </h3>
      </div>
    </div>
  )

  if (onClick) return <button onClick={onClick} style={{ display: 'block', background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left' }}>{inner}</button>
  return to ? <Link to={to}>{inner}</Link> : inner
}

export default function GallerySection() {
  const [c1, c2, c3, c4, c5] = CARDS
  const [showAuthModal, setShowAuthModal] = useState(false)
  const navigate = useNavigate()

  const handleLiveTimingClick = () => {
    if (localStorage.getItem('token')) {
      navigate('/live-timing')
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <>
      {showAuthModal && (
        <AuthRequiredModal
          onClose={() => setShowAuthModal(false)}
          onNavigate={navigate}
        />
      )}
      <section className="pt-16 sm:pt-4 pb-4 px-6">

        <div className="max-w-[620px] mx-auto mb-3">
          <p className="text-[#5b8fa8] text-[12px] uppercase tracking-[4px]">Where will you go next?</p>
        </div>

        <div className="max-w-[620px] mx-auto">

          <div className="flex flex-col sm:flex-row gap-3 mb-3">

            {/* Left column */}
            <div className="flex flex-col gap-3 flex-1">
              <ImageCard {...c1} className="h-[200px] sm:h-[215px]" />
              <ImageCard {...c2} className="h-[200px] sm:h-[390px]" />
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-3 flex-1">
              <ImageCard {...c3} className="h-[200px] sm:h-[390px]" />
              <ImageCard {...c4} className="h-[200px] sm:h-[215px]" onClick={handleLiveTimingClick} />
            </div>

          </div>

          {/* Card 5 — full-width horizontal strip, flush with the block above */}
          <ImageCard {...c5} className="w-full h-[200px] sm:h-[128px]" />

          {/* Profile card — mobile only, always last */}
          <Link to="/profile" className="sm:hidden block mt-3">
            <div
              className="relative overflow-hidden rounded-xl group cursor-pointer h-[200px]"
              style={{ background: 'linear-gradient(135deg, #0c1e2b 0%, #0f3347 55%, #071823 100%)' }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: [
                  'linear-gradient(rgba(0,210,255,0.07) 1px, transparent 1px)',
                  'linear-gradient(90deg, rgba(0,210,255,0.07) 1px, transparent 1px)',
                ].join(','),
                backgroundSize: '32px 32px',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(0,210,255,0.1) 0%, transparent 65%)',
              }} />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 20%, rgba(0,0,0,0.2) 40%, transparent 60%)' }}
              />
              <div className="absolute bottom-0 right-0 pr-4 pb-4 text-right z-10">
                <p className="text-white/45 text-[9px] uppercase tracking-[3px] mb-[3px] font-semibold">
                  My Profile
                </p>
                <h3 className="text-white text-[13px] font-bold leading-snug tracking-wide">
                  Your Journey. Your Stats.
                </h3>
              </div>
            </div>
          </Link>

        </div>
      </section>
    </>
  )
}
