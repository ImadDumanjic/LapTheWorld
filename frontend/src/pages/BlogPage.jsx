import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import blogHeroBanner from '../assets/BlogHeroBanner.png'
import BlogCreateModal from '../components/blog/BlogCreateModal'
import BlogList from '../components/blog/BlogList'
import { useBlogs } from '../hooks/useBlogs'

// ─── Auth-required modal ──────────────────────────────────────────────────────

function AuthRequiredModal({ onClose }) {
  const navigate = useNavigate()

  const handleRegister = () => {
    onClose()
    navigate('/', { state: { showRegister: true } })
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] rounded-2xl p-8"
        style={{
          background: '#0F2027',
          border: '1px solid rgba(44,83,100,0.35)',
          boxShadow: '0 0 0 1px rgba(44,83,100,0.25), 0 0 40px rgba(44,83,100,0.18), 0 24px 60px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="11" y1="1" x2="1"  y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(44,83,100,0.25), rgba(15,32,39,0.5))', border: '1px solid rgba(44,83,100,0.35)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(100,168,200,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        <p className="text-[10px] font-extrabold tracking-[3.5px] uppercase mb-2" style={{ color: 'rgba(44,83,100,0.9)' }}>
          Members Only
        </p>
        <h2 className="font-extrabold uppercase leading-tight mb-3" style={{ fontSize: 22, color: '#fff', letterSpacing: '0.5px' }}>
          Sign in to<br />Start Writing
        </h2>
        <p className="text-[13px] leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.42)' }}>
          Only registered LapTheWorld members can write and publish stories. Join our community
          of F1 fans to share trackside moments, race analysis, and more.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleRegister}
            className="w-full py-3 rounded-[50px] text-white text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-300 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364, #1a3340)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(44,83,100,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
          >
            Register Now
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-[50px] text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-300 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Blog Page ────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const [showAuthModal,   setShowAuthModal]   = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const blogSectionRef = useRef(null)

  const isLoggedIn = !!localStorage.getItem('token')
  const { data, loading, error, page, setPage, refresh } = useBlogs(1)

  const handleStartWriting = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true)
    } else {
      setShowCreateModal(true)
    }
  }

  const handleExplore = () => {
    blogSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBlogCreated = () => {
    setShowCreateModal(false)
    refresh()
  }

  return (
    <>
      {showAuthModal   && <AuthRequiredModal onClose={() => setShowAuthModal(false)} />}
      {showCreateModal && <BlogCreateModal onClose={() => setShowCreateModal(false)} onSuccess={handleBlogCreated} />}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative min-h-svh flex items-center overflow-hidden">

        <img
          src={blogHeroBanner}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          style={{ filter: 'brightness(0.62)' }}
        />

        {/* Left content-zone gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(15,32,39,0.98) 0%, rgba(15,32,39,0.90) 22%, rgba(15,32,39,0.72) 42%, rgba(15,32,39,0.38) 62%, rgba(15,32,39,0.12) 78%, transparent 100%)' }}
        />
        {/* Bottom vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(15,32,39,0.88) 0%, rgba(15,32,39,0.25) 18%, transparent 40%)' }}
        />
        {/* Top vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(15,32,39,0.65) 0%, transparent 22%)' }}
        />
        {/* Mobile supplement */}
        <div className="absolute inset-0 pointer-events-none sm:hidden" style={{ background: 'rgba(15,32,39,0.55)' }} />

        {/* Content */}
        <div className="relative z-10 w-full px-6 sm:px-12 pt-28 pb-16">
          <div className="max-w-[1200px] mx-auto">
            <div className="max-w-[560px]">

              {/* Eyebrow */}
              <p className="flex items-center gap-3 text-[10px] font-extrabold tracking-[4px] uppercase mb-5" style={{ color: 'rgba(100,168,200,0.75)' }}>
                <span aria-hidden="true" style={{ display: 'inline-block', width: 28, height: 1.5, borderRadius: 2, background: 'rgba(44,83,100,0.8)', flexShrink: 0 }} />
                Dare the Stories
              </p>

              {/* Headline */}
              <h1
                className="font-extrabold uppercase leading-none mb-6"
                style={{ fontSize: 'clamp(52px, 8vw, 94px)', letterSpacing: '-0.5px', lineHeight: 0.92 }}
              >
                <span className="block text-white">Every Lap</span>
                <span
                  className="block mt-1"
                  style={{ background: 'linear-gradient(135deg, #5ab3d4 0%, #2C5364 55%, #7dcae3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  Has a Story
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-[14px] leading-relaxed mb-9 max-w-[380px]" style={{ color: 'rgba(255,255,255,0.48)' }}>
                Share your trackside moments, debate race strategies, and relive
                every overtake with fans who live and breathe Formula&nbsp;1.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={handleStartWriting}
                  className="py-3 px-7 rounded-[50px] text-white text-[11px] font-extrabold uppercase tracking-[2.5px] cursor-pointer transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364, #1a3340)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px rgba(44,83,100,0.65)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
                >
                  Start Writing
                </button>
                <button
                  onClick={handleExplore}
                  className="py-3 px-7 rounded-[50px] text-[11px] font-extrabold uppercase tracking-[2.5px] cursor-pointer transition-all duration-300"
                  style={{ color: 'rgba(255,255,255,0.58)', border: '1.5px solid rgba(255,255,255,0.18)', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.38)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.58)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = '' }}
                >
                  Explore
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Blog list section ──────────────────────────────────────────────── */}
      <div
        ref={blogSectionRef}
        className="bg-page-gradient px-6 sm:px-12 py-16"
      >
        <div className="max-w-[1200px] mx-auto">

          {/* Section heading */}
          <div className="mb-8">
            <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[4px] uppercase mb-3" style={{ color: 'rgba(100,168,200,0.6)' }}>
              <span aria-hidden="true" style={{ display: 'inline-block', width: 20, height: 1.5, borderRadius: 2, background: 'rgba(44,83,100,0.7)' }} />
              Community Stories
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-[2px]">
              From the Grid
            </h2>
          </div>

          <BlogList
            data={data}
            loading={loading}
            error={error}
            page={page}
            onPageChange={setPage}
          />

        </div>
      </div>
    </>
  )
}
