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

export default function FeaturedBlogCard({ blog, onClick }) {
  const imageUrl = getBlogImageUrl(blog.image_url)

  return (
    <article
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
      style={{
        minHeight: 420,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 0 0 1px rgba(44,83,100,0.15), 0 20px 60px rgba(0,0,0,0.5)',
      }}
      onClick={onClick}
    >
      {/* Background image or gradient fallback */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.55)' }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0F2027 0%, #1a3d50 50%, #2C5364 100%)' }}
        />
      )}

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(15,32,39,0.97) 0%, rgba(15,32,39,0.7) 35%, rgba(15,32,39,0.2) 65%, transparent 100%)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to right, rgba(15,32,39,0.5) 0%, transparent 60%)' }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 z-10">

        {/* Featured badge */}
        <div>
          <span
            className="inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[3px] px-3 py-1.5 rounded-full"
            style={{ color: 'rgba(100,168,200,0.9)', background: 'rgba(44,83,100,0.25)', border: '1px solid rgba(44,83,100,0.35)' }}
          >
            Featured Story
          </span>
        </div>

        {/* Bottom content */}
        <div className="max-w-[640px]">
          <h2
            className="font-extrabold uppercase text-white mb-3 leading-tight"
            style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', letterSpacing: '-0.3px' }}
          >
            {blog.title}
          </h2>
          <p
            className="text-[14px] leading-relaxed mb-5"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            {blog.content.length > 180 ? blog.content.slice(0, 180) + '…' : blog.content}
          </p>
          <div className="flex items-center gap-4">
            {/* Author avatar placeholder */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold uppercase flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364)', color: '#fff' }}
            >
              {authorName(blog.author).charAt(0)}
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-white/70">
                {authorName(blog.author)}
              </p>
              <p className="text-[10px] uppercase tracking-[2px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {formatDate(blog.created_at)}
              </p>
            </div>
          </div>
        </div>

      </div>
    </article>
  )
}
