import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CONSENT_KEY = 'cookieConsent'

export function useCookieConsent() {
  const [consent, setConsent] = useState(() => localStorage.getItem(CONSENT_KEY))

  const accept = (level) => {
    localStorage.setItem(CONSENT_KEY, level)
    setConsent(level)
  }

  return { consent, acceptAll: () => accept('all'), acceptEssential: () => accept('essential') }
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const { consent, acceptAll, acceptEssential } = useCookieConsent()

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      // Brief delay so it doesn't flash immediately on page load
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  const handleAcceptAll = () => { acceptAll(); setVisible(false) }
  const handleEssential = () => { acceptEssential(); setVisible(false) }

  if (!visible || consent) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        width: 'min(560px, calc(100vw - 32px))',
        background: 'linear-gradient(145deg, rgba(10,26,38,0.98) 0%, rgba(5,14,22,0.99) 100%)',
        border: '1px solid rgba(44,83,100,0.4)',
        borderRadius: 16,
        boxShadow: '0 0 0 1px rgba(44,83,100,0.15), 0 24px 64px rgba(0,0,0,0.7), 0 0 40px rgba(44,83,100,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '20px 24px',
        animation: 'cookieFadeUp 0.35s ease-out both',
      }}
    >
      <style>{`
        @keyframes cookieFadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      {/* Dot grid */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 16, pointerEvents: 'none', overflow: 'hidden',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }} />

      <div style={{ position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(44,83,100,0.2)', border: '1px solid rgba(44,83,100,0.35)',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(100,168,200,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
              Your Privacy
            </span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(100,168,200,0.45)', textTransform: 'uppercase', letterSpacing: '0.2em', paddingTop: 2 }}>
            GDPR Notice
          </span>
        </div>

        {/* Body */}
        <p style={{ fontSize: 12.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
          We use essential cookies to keep you signed in and the app functional. No tracking or advertising cookies are used.
        </p>

        {/* Expanded detail */}
        {expanded && (
          <div style={{
            marginBottom: 12, padding: '12px 14px', borderRadius: 10,
            background: 'rgba(44,83,100,0.08)', border: '1px solid rgba(44,83,100,0.2)',
          }}>
            <p style={{ fontSize: 11.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              <strong style={{ color: 'rgba(100,168,200,0.7)', display: 'block', marginBottom: 4 }}>Essential cookies (always active)</strong>
              Authentication token — keeps you logged in during your session. Stored in localStorage, cleared on logout. No third-party services receive this data.
            </p>
          </div>
        )}

        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            background: 'none', border: 'none', padding: 0, marginBottom: 14,
            fontSize: 11.5, color: 'rgba(100,168,200,0.55)', cursor: 'pointer',
            textDecoration: 'underline', textDecorationColor: 'rgba(100,168,200,0.25)',
          }}
        >
          {expanded ? 'Show less ↑' : 'What do we store? ↓'}
        </button>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleAcceptAll}
            style={{
              flex: 1, minWidth: 120, padding: '9px 16px', borderRadius: 50,
              background: 'rgba(0,210,255,0.9)', border: 'none', color: '#fff',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'background 150ms ease, box-shadow 150ms ease',
              boxShadow: '0 0 20px rgba(0,210,255,0.25)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#00D2FF'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,210,255,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,210,255,0.9)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,210,255,0.25)' }}
          >
            Accept All
          </button>
          <button
            onClick={handleEssential}
            style={{
              flex: 1, minWidth: 120, padding: '9px 16px', borderRadius: 50,
              background: 'transparent', border: '1px solid rgba(44,83,100,0.45)', color: 'rgba(255,255,255,0.55)',
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'border-color 150ms ease, color 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(44,83,100,0.75)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(44,83,100,0.45)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
          >
            Essential Only
          </button>
        </div>

        {/* Footer link */}
        <p style={{ marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.22)', textAlign: 'center' }}>
          <Link to="/privacy" style={{ color: 'rgba(100,168,200,0.45)', textDecoration: 'underline', textDecorationColor: 'rgba(100,168,200,0.2)' }}>
            Privacy Policy
          </Link>
          {' · '}
          <Link to="/terms" style={{ color: 'rgba(100,168,200,0.45)', textDecoration: 'underline', textDecorationColor: 'rgba(100,168,200,0.2)' }}>
            Terms of Service
          </Link>
        </p>
      </div>
    </div>
  )
}
