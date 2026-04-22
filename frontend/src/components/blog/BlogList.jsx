import FeaturedBlogCard from './FeaturedBlogCard'
import BlogCard from './BlogCard'

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-9 h-9 flex items-center justify-center rounded-full text-[12px] font-extrabold transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
        style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent' }}
        onMouseEnter={e => { if (page > 1) e.currentTarget.style.borderColor = 'rgba(44,83,100,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        aria-label="Previous page"
      >
        ←
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="w-9 h-9 flex items-center justify-center rounded-full text-[11px] font-extrabold uppercase tracking-[1px] transition-all duration-200 cursor-pointer"
          style={
            p === page
              ? { background: 'linear-gradient(135deg, #3d7a96, #2C5364, #1a3340)', color: '#fff', border: '1px solid transparent' }
              : { color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent' }
          }
          onMouseEnter={e => { if (p !== page) e.currentTarget.style.borderColor = 'rgba(44,83,100,0.5)' }}
          onMouseLeave={e => { if (p !== page) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-full text-[12px] font-extrabold transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
        style={{ color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent' }}
        onMouseEnter={e => { if (page < totalPages) e.currentTarget.style.borderColor = 'rgba(44,83,100,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        aria-label="Next page"
      >
        →
      </button>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      className="rounded-2xl px-8 py-20 text-center"
      style={{ background: 'rgba(15,32,39,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <p className="text-[10px] font-extrabold uppercase tracking-[4px] mb-3" style={{ color: 'rgba(44,83,100,0.8)' }}>
        No Stories Yet
      </p>
      <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Be the first to share your race weekend story.
      </p>
    </div>
  )
}

// ─── Status ───────────────────────────────────────────────────────────────────

function StatusBox({ type, message }) {
  return (
    <div
      className="rounded-xl border border-white/[0.05] px-4 py-16 text-center"
      style={{ background: 'rgba(15,32,39,0.6)' }}
    >
      {type === 'loading' ? (
        <p className="text-[11px] font-extrabold uppercase tracking-[4px] text-white/30 animate-pulse">
          Loading stories…
        </p>
      ) : (
        <>
          <p className="text-[11px] font-extrabold uppercase tracking-[4px] text-white/40 mb-3">Unable to load stories</p>
          <p className="text-[12px] text-white/25">{message}</p>
        </>
      )}
    </div>
  )
}

// ─── Blog list ────────────────────────────────────────────────────────────────

export default function BlogList({ data, loading, error, page, onPageChange, onSelectBlog }) {
  if (loading) return <StatusBox type="loading" />
  if (error)   return <StatusBox type="error" message={error} />
  if (!data?.blogs?.length) return <EmptyState />

  const [featured, ...rest] = data.blogs

  return (
    <div>
      {/* Featured */}
      <div className="mb-6">
        <FeaturedBlogCard blog={featured} onClick={() => onSelectBlog(featured)} />
      </div>

      {/* Grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rest.map(blog => (
            <BlogCard key={blog.id} blog={blog} onClick={() => onSelectBlog(blog)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={data.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  )
}
