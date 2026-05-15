export default function AuthRequiredModal({ onClose, onNavigate }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      {/* Backdrop */}
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />
      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: 420,
        background: '#0F2027', borderRadius: 4, padding: '40px 36px',
        boxShadow: '0 0 0 2px #2C5364, 0 0 24px 6px rgba(44,83,100,0.5), 0 0 60px 16px rgba(44,83,100,0.2)',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', padding: 4, lineHeight: 0,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(0,210,255,0.08)', border: '1px solid rgba(0,210,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: 800,
          letterSpacing: '3px', textTransform: 'uppercase', marginBottom: 12,
        }}>
          Members Only
        </h3>

        {/* Description */}
        <p style={{
          textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: 13,
          lineHeight: 1.7, marginBottom: 28,
        }}>
          Live Timing is available to registered users only. Create a free account or log in to access real-time F1 session data.
        </p>

        {/* CTA button */}
        <button
          onClick={() => { onClose(); onNavigate('/auth') }}
          style={{
            width: '100%', padding: '13px 0', borderRadius: 8, cursor: 'pointer',
            border: 'none', background: 'linear-gradient(135deg, #0F2027, #2C5364)',
            boxShadow: '0 0 0 1px #2C5364, 0 0 14px 2px rgba(0,210,255,0.15)',
            color: '#fff', fontSize: 11, fontWeight: 800,
            letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'inherit',
            transition: 'box-shadow 0.2s, filter 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.2)' }}
          onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)' }}
        >
          Log In / Register
        </button>

        {/* Dismiss link */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              color: 'rgba(255,255,255,0.25)', fontSize: 12,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)' }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
