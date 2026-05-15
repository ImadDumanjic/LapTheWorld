import { useNavigate } from 'react-router-dom'
import GallerySection from '../components/landing/GallerySection'
import VerticalTitle from '../components/landing/VerticalTitle'

export default function LandingPage() {
  const navigate   = useNavigate()
  const isLoggedIn = !!localStorage.getItem('userId')

  return (
    <div className="bg-page-gradient h-svh overflow-y-auto flex flex-col justify-start sm:justify-center">
      {isLoggedIn && (
        <button
          aria-label="Go to profile"
          onClick={() => navigate('/profile')}
          className="hidden sm:flex"
          style={{
            position: 'fixed',
            top: 20,
            right: 24,
            zIndex: 50,
            width: 44,
            height: 44,
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(90,179,212,0.35)',
            cursor: 'pointer',
            background: 'rgba(90,179,212,0.08)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: 'rgba(90,179,212,0.9)',
            transition: 'background 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(90,179,212,0.2)'; e.currentTarget.style.transform = 'scale(1.08)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(90,179,212,0.08)'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      )}
      <VerticalTitle />
      <GallerySection />
    </div>
  )
}
