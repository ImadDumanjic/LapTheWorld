import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchMyBlogs, deleteBlog, getBlogImageUrl } from '../services/blogService'
import BlogEditModal from '../components/blog/BlogEditModal'

const STATUS_CONFIG = {
  pending:  { label: 'Pending Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  approved: { label: 'Approved',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)' },
  rejected: { label: 'Rejected',       color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)' },
  draft:    { label: 'Draft',          color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[1.5px]"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function DeleteButton({ onConfirm, disabled }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-[11px]">
        <button
          onClick={() => { onConfirm(); setConfirming(false) }}
          className="font-extrabold uppercase tracking-[1px] transition-colors"
          style={{ color: '#ef4444' }}
        >
          Delete
        </button>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <button
          onClick={() => setConfirming(false)}
          className="transition-colors"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Cancel
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      disabled={disabled}
      className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[1px] transition-all duration-200 disabled:opacity-40"
      style={{ color: 'rgba(255,255,255,0.3)' }}
      onMouseEnter={e => { e.currentTarget.style.color = '#ef4444' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4h6v2" />
      </svg>
      Delete
    </button>
  )
}

export default function MyBlogsPage() {
  const navigate = useNavigate()
  const [data,        setData]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [page,        setPage]        = useState(1)
  const [editingBlog, setEditingBlog] = useState(null)
  const [deleting,    setDeleting]    = useState(null)

  const load = useCallback(async (p) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchMyBlogs(p)
      setData(result)
    } catch (err) {
      if (err.message?.includes('401') || err.message?.toLowerCase().includes('auth')) {
        navigate('/auth')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/auth'); return }
    load(page)
  }, [page, load, navigate])

  async function handleDelete(id) {
    setDeleting(id)
    try {
      await deleteBlog(id)
      setData(prev => ({
        ...prev,
        blogs: prev.blogs.filter(b => b.id !== id),
        total: prev.total - 1,
      }))
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(null)
    }
  }

  function handleEditSuccess() {
    load(page)
  }

  return (
    <>
      {editingBlog && (
        <BlogEditModal
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onSuccess={() => { setEditingBlog(null); handleEditSuccess() }}
        />
      )}

      <div
        className="min-h-screen px-6 sm:px-12 pt-32 pb-16"
        style={{ background: 'linear-gradient(180deg, #0a1a22 0%, #0F2027 100%)' }}
      >
        <div className="max-w-[1100px] mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="flex items-center gap-2 text-[10px] font-extrabold tracking-[4px] uppercase mb-3" style={{ color: 'rgba(100,168,200,0.6)' }}>
              <span aria-hidden="true" style={{ display: 'inline-block', width: 20, height: 1.5, borderRadius: 2, background: 'rgba(44,83,100,0.7)' }} />
              Your Stories
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-[2px]">
              My Blog Posts
            </h1>
            <p className="text-[13px] mt-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Manage your submitted posts and track their review status.
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-white/50 animate-spin" />
            </div>
          )}

          {error && (
            <div
              className="px-5 py-4 rounded-xl text-[13px] mb-6"
              style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}
            >
              {error}
            </div>
          )}

          {!loading && !error && data && data.blogs.length === 0 && (
            <div
              className="flex flex-col items-center text-center py-24 rounded-2xl"
              style={{ border: '1px dashed rgba(44,83,100,0.3)', background: 'rgba(44,83,100,0.04)' }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(100,168,200,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <p className="text-[11px] font-extrabold uppercase tracking-[3px] mb-2" style={{ color: 'rgba(100,168,200,0.5)' }}>No Stories Yet</p>
              <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.3)' }}>You haven't submitted any blog posts yet.</p>
              <button
                onClick={() => navigate('/blog')}
                className="mt-6 py-2.5 px-6 rounded-[50px] text-white text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364, #1a3340)' }}
              >
                Start Writing
              </button>
            </div>
          )}

          {!loading && !error && data && data.blogs.length > 0 && (
            <div className="flex flex-col gap-4">
              {data.blogs.map(blog => {
                const imageUrl = getBlogImageUrl(blog.image_url)
                return (
                  <div
                    key={blog.id}
                    className="rounded-2xl overflow-hidden flex flex-col sm:flex-row gap-0"
                    style={{
                      background: 'rgba(15,32,39,0.85)',
                      border: '1px solid rgba(44,83,100,0.2)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                    }}
                  >
                    {/* Image */}
                    <div
                      className="flex-shrink-0 sm:w-48"
                      style={{ minHeight: 140 }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                          style={{ minHeight: 140, maxHeight: 200 }}
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ minHeight: 140, background: 'linear-gradient(135deg, #0F2027 0%, #1a3d50 50%, #2C5364 100%)' }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <h2
                          className="font-extrabold uppercase text-white leading-tight"
                          style={{ fontSize: 16, letterSpacing: '0.3px', flex: 1 }}
                        >
                          {blog.title}
                        </h2>
                        <StatusBadge status={blog.status} />
                      </div>

                      <p
                        className="text-[12px] leading-relaxed line-clamp-2 flex-1"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {blog.content}
                      </p>

                      <div
                        className="flex items-center justify-between pt-3 flex-wrap gap-3"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        {blog.created_at && (
                          <p className="text-[10px] uppercase tracking-[1.5px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            {formatDate(blog.created_at)}
                          </p>
                        )}

                        <div className="flex items-center gap-4 ml-auto">
                          <button
                            onClick={() => setEditingBlog(blog)}
                            className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[1px] transition-all duration-200"
                            style={{ color: 'rgba(255,255,255,0.3)' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(100,168,200,0.9)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>

                          <DeleteButton
                            onConfirm={() => handleDelete(blog.id)}
                            disabled={deleting === blog.id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && data && data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-9 h-9 rounded-lg text-[12px] font-extrabold transition-all duration-200"
                  style={
                    p === page
                      ? { background: 'rgba(44,83,100,0.6)', color: '#fff', border: '1px solid rgba(44,83,100,0.7)' }
                      : { background: 'rgba(44,83,100,0.08)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(44,83,100,0.15)' }
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
