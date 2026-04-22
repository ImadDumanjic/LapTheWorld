import { useEffect } from 'react'
import { getBlogImageUrl } from '../../services/blogService'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function authorName(author) {
  if (!author) return 'Anonymous'
  const full = [author.firstName, author.lastName].filter(Boolean).join(' ')
  return full || author.username
}

export default function BlogPreviewModal({ blog, onClose }) {
  const imageUrl = getBlogImageUrl(blog.image_url)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-8"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[760px] rounded-2xl overflow-hidden flex flex-col"
        style={{
          maxHeight: '90vh',
          background: '#0F2027',
          border: '1px solid rgba(44,83,100,0.35)',
          boxShadow: '0 0 0 1px rgba(44,83,100,0.2), 0 0 60px rgba(44,83,100,0.15), 0 32px 80px rgba(0,0,0,0.75)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.5)', background: 'rgba(15,32,39,0.85)', border: '1px solid rgba(255,255,255,0.1)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="11" y1="1" x2="1"  y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Cover image */}
        {imageUrl ? (
          <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 240 }}>
            <img
              src={imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.65)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, #0F2027 0%, transparent 55%)' }}
            />
          </div>
        ) : (
          <div
            className="flex-shrink-0"
            style={{ height: 8, background: 'linear-gradient(90deg, #2C5364, #3d7a96, #2C5364)' }}
          />
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-8 sm:px-10 py-8">

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-extrabold uppercase flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364)', color: '#fff' }}
            >
              {authorName(blog.author).charAt(0)}
            </div>
            <div>
              <p className="text-[12px] font-extrabold text-white/70">
                {authorName(blog.author)}
              </p>
              <p className="text-[10px] uppercase tracking-[2px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {formatDate(blog.created_at)}
              </p>
            </div>
          </div>

          {/* Title */}
          <h2
            className="font-extrabold uppercase text-white leading-tight mb-6"
            style={{ fontSize: 'clamp(22px, 3vw, 34px)', letterSpacing: '-0.2px' }}
          >
            {blog.title}
          </h2>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(44,83,100,0.3)', marginBottom: 24 }} />

          {/* Full content */}
          <p
            className="text-[14px] leading-[1.85] whitespace-pre-wrap"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            {blog.content}
          </p>

        </div>
      </div>
    </div>
  )
}
