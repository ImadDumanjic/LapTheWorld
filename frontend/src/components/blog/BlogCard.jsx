import { getBlogImageUrl } from '../../services/blogService'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function authorName(author) {
  if (!author) return 'Anonymous'
  const full = [author.firstName, author.lastName].filter(Boolean).join(' ')
  return full || author.username
}

export default function BlogCard({ blog }) {
  const imageUrl = getBlogImageUrl(blog.image_url)

  return (
    <article
      className="group rounded-xl overflow-hidden flex flex-col h-full transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(15,32,39,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(44,83,100,0.3), 0 8px 32px rgba(0,0,0,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)' }}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 160 }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ filter: 'brightness(0.75)' }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, #0F2027 0%, #1a3d50 50%, #2C5364 100%)' }}
          />
        )}
        {/* Subtle bottom fade into card */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(15,32,39,0.7) 0%, transparent 50%)' }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3
          className="font-extrabold uppercase text-white leading-tight mb-3 line-clamp-2"
          style={{ fontSize: 15, letterSpacing: '0.2px' }}
        >
          {blog.title}
        </h3>
        <p
          className="text-[12px] leading-relaxed flex-1 line-clamp-3 mb-4"
          style={{ color: 'rgba(255,255,255,0.42)' }}
        >
          {blog.content}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-extrabold uppercase flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364)', color: '#fff' }}
          >
            {authorName(blog.author).charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold text-white/60 truncate">
              {authorName(blog.author)}
            </p>
            <p className="text-[9px] uppercase tracking-[1.5px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {formatDate(blog.created_at)}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
