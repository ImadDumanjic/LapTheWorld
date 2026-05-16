import { Link } from 'react-router-dom'

export default function LegalFooter() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div
        className="px-6 sm:px-12"
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        <div
          className="flex flex-col items-center sm:flex-row sm:justify-between"
          style={{ padding: '20px 0', gap: '10px' }}
        >
          <span className="sm:-ml-[45px]" style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
            © {new Date().getFullYear()} LapTheWorld. All rights reserved.
          </span>
          <div className="sm:-mr-[40px]" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
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
        </div>
      </div>
    </footer>
  )
}
