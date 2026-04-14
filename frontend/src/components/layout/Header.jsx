import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Blog Section',    to: '/blog' },
  { label: 'Standings',       to: '/championship' },
  { label: 'Calendar',        to: '/calendar' },
  { label: 'Live Timing',     to: '#' },
  { label: 'GP Travel Guide', to: '#' },
  { label: 'Profile',         to: '/profile' },
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
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 22,
            boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.06) inset',
            padding: '9px 9px 9px 16px',
          }}
        >
          {/* Logo */}
          <Link to="/landing" className="select-none flex-shrink-0">
            <img src="/LapTheWorld.svg" alt="Lap The World" style={{ height: 55, width: 'auto' }} />
          </Link>

          {/* Menu button */}
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
        </div>

        {/* Dropdown */}
        <nav
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
          {NAV_ITEMS.map(({ label, to }, i) => (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                padding: '12px 20px',
                fontSize: 11,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                textDecoration: 'none',
                borderBottom: i < NAV_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'transparent' }}
            >
              {label}
            </Link>
          ))}
        </nav>

      </div>
      </div>
    </header>
  )
}
