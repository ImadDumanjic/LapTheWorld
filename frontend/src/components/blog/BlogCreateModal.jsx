import { useState, useRef } from 'react'
import { createBlog } from '../../services/blogService'

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="11" y1="1" x2="1"  y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const ImageIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(100,168,200,0.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
)

export default function BlogCreateModal({ onClose, onSuccess }) {
  const [title,      setTitle]      = useState('')
  const [content,    setContent]    = useState('')
  const [imageFile,  setImageFile]  = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = (e) => {
    e.stopPropagation()
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('title',   title.trim())
      fd.append('content', content.trim())
      if (imageFile) fd.append('image', imageFile)
      await createBlog(fd)
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[640px] rounded-2xl p-8 max-h-[90vh] overflow-y-auto"
        style={{
          background: '#0F2027',
          border: '1px solid rgba(44,83,100,0.35)',
          boxShadow: '0 0 0 1px rgba(44,83,100,0.2), 0 0 50px rgba(44,83,100,0.15), 0 24px 60px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        >
          <XIcon />
        </button>

        {/* Header */}
        <p className="text-[10px] font-extrabold tracking-[3.5px] uppercase mb-2" style={{ color: 'rgba(44,83,100,0.9)' }}>
          New Post
        </p>
        <h2 className="font-extrabold uppercase mb-6" style={{ fontSize: 22, color: '#fff', letterSpacing: '0.5px' }}>
          Write Your Story
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Cover image upload */}
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-[2.5px] mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Cover Image
            </label>
            <div
              className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
              style={{
                height: imagePreview ? 'auto' : 120,
                border: '1.5px dashed rgba(44,83,100,0.4)',
                background: 'rgba(44,83,100,0.06)',
              }}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(44,83,100,0.7)'; e.currentTarget.style.background = 'rgba(44,83,100,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = imagePreview ? 'rgba(44,83,100,0.4)' : 'rgba(44,83,100,0.4)'; e.currentTarget.style.background = 'rgba(44,83,100,0.06)' }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full rounded-xl" style={{ maxHeight: 220, objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full"
                    style={{ background: 'rgba(15,32,39,0.85)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    <XIcon />
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <ImageIcon />
                  <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Click or drag &amp; drop to upload cover image
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-[2.5px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Title
              </label>
              <span
                className="text-[10px] font-extrabold tabular-nums"
                style={{ color: title.length >= 180 ? '#f87171' : 'rgba(255,255,255,0.2)' }}
              >
                {title.length}/200
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give your story a headline..."
              maxLength={200}
              className="w-full rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none transition-all duration-200"
              style={{
                background: 'rgba(44,83,100,0.08)',
                border: '1px solid rgba(44,83,100,0.25)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(44,83,100,0.7)'; e.currentTarget.style.background = 'rgba(44,83,100,0.12)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(44,83,100,0.25)'; e.currentTarget.style.background = 'rgba(44,83,100,0.08)' }}
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-[2.5px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Story
              </label>
              <span
                className="text-[10px] font-extrabold tabular-nums"
                style={{ color: content.length >= 9500 ? '#f87171' : 'rgba(255,255,255,0.2)' }}
              >
                {content.length}/10 000
              </span>
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share your race weekend experience, insights, and moments..."
              rows={7}
              maxLength={10000}
              className="w-full rounded-xl px-4 py-3 text-[14px] text-white placeholder-white/20 outline-none resize-none transition-all duration-200"
              style={{
                background: 'rgba(44,83,100,0.08)',
                border: '1px solid rgba(44,83,100,0.25)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(44,83,100,0.7)'; e.currentTarget.style.background = 'rgba(44,83,100,0.12)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(44,83,100,0.25)'; e.currentTarget.style.background = 'rgba(44,83,100,0.08)' }}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-[12px] px-3 py-2 rounded-lg" style={{ color: '#f87171', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-[50px] text-white text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364, #1a3340)' }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 28px rgba(44,83,100,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
            >
              {loading ? 'Publishing…' : 'Publish Story'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-[50px] text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-200 cursor-pointer"
              style={{ color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
