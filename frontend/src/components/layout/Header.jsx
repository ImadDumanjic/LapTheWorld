import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../../services/authService'

const BlogIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)
const StandingsIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const TimingIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const TravelIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)
const ProfileIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const NAV_ITEMS = [
  { label: 'Blog Section',    to: '/blog',         icon: <BlogIcon /> },
  { label: 'Standings',       to: '/championship', icon: <StandingsIcon /> },
  { label: 'Calendar',        to: '/calendar',     icon: <CalendarIcon /> },
  { label: 'Live Timing',     to: '#',             icon: <TimingIcon /> },
  { label: 'GP Travel Guide', to: '/travel-guide', icon: <TravelIcon /> },
  { label: 'Profile',         to: '/profile',      icon: <ProfileIcon /> },
]

// Uses transform-box: fill-box so each bar rotates around its own center
function MenuIcon({ open }) {
  const bar = {
    transformBox: 'fill-box',
    transformOrigin: 'center',
    transition: 'transform 0.28s ease, opacity 0.2s ease',
  }
  return (
    <svg
      width="20" height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Top bar → top arm of X */}
      <rect
        x="3" y="11.1" width="18" height="1.8" rx="0.9"
        style={{
          ...bar,
          transform: open ? 'rotate(45deg)' : 'translateY(-4px)',
        }}
      />
      {/* Middle bar → fades out */}
      <rect
        x="3" y="11.1" width="18" height="1.8" rx="0.9"
        style={{
          ...bar,
          opacity: open ? 0 : 1,
        }}
      />
      {/* Bottom bar → bottom arm of X */}
      <rect
        x="3" y="11.1" width="18" height="1.8" rx="0.9"
        style={{
          ...bar,
          transform: open ? 'rotate(-45deg)' : 'translateY(4px)',
        }}
      />
    </svg>
  )
}

export default function Header() {
  const [open, setOpen]           = useState(false)
  const [hoverMenu, setHoverMenu] = useState(false)
  const [visible, setVisible]     = useState(true)
  const lastScrollY               = useRef(0)
  const navigate                  = useNavigate()
  const { pathname }              = useLocation()
  const isAdmin                   = pathname === '/admin'

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/auth')
  }

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY

      if (current <= 20) {
        // Always show when near the top
        setVisible(true)
      } else if (current > lastScrollY.current) {
        // Scrolling down — hide and close menu
        setVisible(false)
        setOpen(false)
      } else {
        // Scrolling up — reveal
        setVisible(true)
      }

      lastScrollY.current = current
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      style={{
        paddingTop: 20,
        transform: visible ? 'translateY(0)' : 'translateY(-130%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.4s ease, opacity 0.35s ease',
      }}
    >
      {/* Shared container — matches all page content: px-6 sm:px-12 outer → max-w-[1200px] inner */}
      <div className="px-6 sm:px-12">
      <div className="relative max-w-[1200px] mx-auto pointer-events-auto">

        {/* Pill navbar */}
        <div
          className="flex items-center justify-between"
          style={{
            background: isAdmin ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isAdmin ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: 22,
            boxShadow: isAdmin
              ? '0 4px 20px rgba(0,0,0,0.08)'
              : '0 8px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.06) inset',
            padding: '9px 9px 9px 16px',
          }}
        >
          {/* Logo */}
          <Link to="/landing" className="select-none flex-shrink-0">
            <img src="/LapTheWorld.svg" alt="Lap The World" style={{ height: 55, width: 'auto' }} />
          </Link>

          {/* Admin: red logout button */}
          {isAdmin ? (
            <button
              onClick={handleLogout}
              style={{
                height: 44,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                paddingLeft: 20,
                paddingRight: 20,
                cursor: 'pointer',
                border: 'none',
                background: '#ef4444',
                color: '#fff',
                fontSize: 11,
                fontFamily: 'inherit',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 600,
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#dc2626' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ef4444' }}
            >
              Log Out
            </button>
          ) : (
            /* Hamburger menu button */
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen(v => !v)}
              onMouseEnter={() => setHoverMenu(true)}
              onMouseLeave={() => setHoverMenu(false)}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, filter 0.2s ease, background 0.2s ease',
                background: open
                  ? 'rgba(255,255,255,0.14)'
                  : hoverMenu
                    ? 'rgba(255,255,255,0.12)'
                    : 'rgba(255,255,255,0.07)',
                transform: hoverMenu ? 'scale(1.05)' : 'scale(1)',
                filter: hoverMenu ? 'brightness(1.4)' : 'brightness(1)',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              <MenuIcon open={open} />
            </button>
          )}
        </div>

        {/* Dropdown — hidden on admin page */}
        {!isAdmin && <nav
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 200,
            background: 'rgba(10, 22, 30, 0.65)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            transformOrigin: 'top right',
            transform: open ? 'scaleY(1)' : 'scaleY(0)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transition: 'transform 0.25s ease, opacity 0.2s ease',
          }}
        >
          {NAV_ITEMS.map(({ label, to, icon }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 20px',
                fontSize: 11,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                transition: 'color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent' }}
            >
              {icon}
              {label}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '12px 20px',
              fontSize: 11,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'rgba(220,80,80,0.7)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'color 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,120,120,0.95)'; e.currentTarget.style.background = 'rgba(200,50,50,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(220,80,80,0.7)'; e.currentTarget.style.background = 'transparent' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log Out
          </button>
        </nav>}

      </div>
      </div>
    </header>
  )
}
