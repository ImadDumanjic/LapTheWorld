import { Link } from 'react-router-dom'

export default function LegalFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '20px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
      }}
    >
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
        © {new Date().getFullYear()} LapTheWorld. All rights reserved.
      </span>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Privacy Policy', to: '/privacy' },
          { label: 'Terms of Service', to: '/terms' },
        ].map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            style={{
              fontSize: 11,
              color: 'rgba(100,168,200,0.4)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(100,168,200,0.75)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(100,168,200,0.4)' }}
          >
            {label}
          </Link>
        ))}
      </div>
    </footer>
  )
}
