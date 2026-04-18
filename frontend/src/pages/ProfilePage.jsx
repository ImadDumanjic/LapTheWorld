import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { fetchProfile, updateProfile, deleteAccount, getTokenUserId } from '../services/userService'
import { logout } from '../services/authService'

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-[420px] rounded-2xl p-8"
        style={{
          background: '#0F2027',
          border: '1px solid rgba(200,50,50,0.25)',
          boxShadow: '0 0 0 1px rgba(200,50,50,0.12), 0 0 40px rgba(200,50,50,0.1), 0 24px 60px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="11" y1="1" x2="1"  y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(200,50,50,0.2), rgba(15,32,39,0.5))', border: '1px solid rgba(200,50,50,0.25)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(220,80,80,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </div>

        <p className="text-[10px] font-extrabold tracking-[3.5px] uppercase mb-2" style={{ color: 'rgba(220,80,80,0.8)' }}>
          Destructive Action
        </p>
        <h2 className="font-extrabold uppercase leading-tight mb-3" style={{ fontSize: 20, color: '#fff', letterSpacing: '0.5px' }}>
          Delete Your Account?
        </h2>
        <p className="text-[13px] leading-relaxed mb-7" style={{ color: 'rgba(255,255,255,0.42)' }}>
          This action is permanent and cannot be undone. All your data, posts, and account information will be erased immediately.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-[50px] text-white text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-300 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #c0392b, #922b21)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(192,57,43,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
          >
            Yes, Delete My Account
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-[50px] text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-300 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function Field({ label, value, editing, name, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[10px] font-extrabold uppercase tracking-[3px]"
        style={{ color: 'rgba(100,168,200,0.65)' }}
      >
        {label}
      </span>
      {editing ? (
        <input
          name={name}
          value={value ?? ''}
          onChange={onChange}
          className="rounded-xl px-4 py-2.5 text-[14px] text-white outline-none transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(44,83,100,0.45)',
            color: '#fff',
          }}
          onFocus={e => { e.currentTarget.style.border = '1px solid rgba(100,168,200,0.65)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(44,83,100,0.18)' }}
          onBlur={e => { e.currentTarget.style.border = '1px solid rgba(44,83,100,0.45)'; e.currentTarget.style.boxShadow = '' }}
        />
      ) : (
        <span className="text-[14px]" style={{ color: value ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)' }}>
          {value || '—'}
        </span>
      )}
    </div>
  )
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState(false)
  const [form, setForm]           = useState({})
  const [saving, setSaving]       = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/auth')
    }
  }, [navigate])

  // Fetch profile
  useEffect(() => {
    fetchProfile()
      .then(data => {
        setUser(data)
        setForm({
          firstName: data.firstName ?? '',
          lastName:  data.lastName  ?? '',
          email:     data.email     ?? '',
          phone:     data.phone     ?? '',
        })
      })
      .catch(() => {
        // Token invalid / expired — force logout
        logout()
        navigate('/auth')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'
    : '?'

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const userId = getTokenUserId()
      const updated = await updateProfile(userId, form)
      setUser(updated)
      setForm({
        firstName: updated.firstName ?? '',
        lastName:  updated.lastName  ?? '',
        email:     updated.email     ?? '',
        phone:     updated.phone     ?? '',
      })
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setForm({
      firstName: user.firstName ?? '',
      lastName:  user.lastName  ?? '',
      email:     user.email     ?? '',
      phone:     user.phone     ?? '',
    })
    setEditing(false)
  }

  const handleDeleteConfirm = async () => {
    try {
      const userId = getTokenUserId()
      await deleteAccount(userId)
      logout()
      navigate('/auth')
    } catch (err) {
      toast.error(err.message || 'Failed to delete account')
      setShowDelete(false)
    }
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F2027',
            color: '#fff',
            border: '1px solid rgba(44,83,100,0.4)',
            borderRadius: 12,
            fontSize: 13,
          },
          success: { iconTheme: { primary: '#5ab3d4', secondary: '#0F2027' } },
          error:   { iconTheme: { primary: '#e74c3c', secondary: '#0F2027' } },
        }}
      />

      {showDelete && (
        <DeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {/* Page background */}
      <div
        className="min-h-svh px-6 sm:px-12 pt-32 pb-20 flex flex-col items-center"
        style={{ background: 'linear-gradient(160deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' }}
      >
        <div className="w-full max-w-[1200px]">

          {/* Page heading */}
          <div className="mb-10">
            <p className="flex items-center gap-3 text-[10px] font-extrabold tracking-[4px] uppercase mb-3" style={{ color: 'rgba(100,168,200,0.7)' }}>
              <span aria-hidden="true" style={{ display: 'inline-block', width: 28, height: 1.5, borderRadius: 2, background: 'rgba(44,83,100,0.8)', flexShrink: 0 }} />
              My Account
            </p>
            <h1
              className="font-extrabold uppercase"
              style={{ fontSize: 'clamp(24px,3.5vw,38px)', lineHeight: 1, letterSpacing: '-0.5px', color: '#fff' }}
            >
              Profile
            </h1>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div
              className="w-full rounded-2xl p-8 flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(44,83,100,0.3)',
                minHeight: 260,
              }}
            >
              <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Loading...</span>
            </div>
          )}

          {/* Profile card */}
          {!loading && user && (
            <>
              <div
                className="w-full rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(44,83,100,0.45)',
                  boxShadow: '0 0 0 1px rgba(44,83,100,0.15), 0 0 60px rgba(44,83,100,0.12), 0 32px 80px rgba(0,0,0,0.55)',
                }}
              >
                {/* Teal top accent bar */}
                <div style={{ height: 3, background: 'linear-gradient(to right, #2C5364, #5ab3d4, #2C5364)' }} />

                <div className="flex flex-col sm:flex-row gap-0">

                  {/* ── Left: Avatar ── */}
                  <div
                    className="flex flex-col items-center justify-center p-10 flex-shrink-0"
                    style={{
                      borderRight: '1px solid rgba(44,83,100,0.25)',
                      minWidth: 220,
                      background: 'rgba(0,0,0,0.12)',
                    }}
                  >
                    {/* Avatar circle */}
                    <div
                      className="flex items-center justify-center select-none"
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #203A43, #2C5364)',
                        border: '2.5px solid rgba(90,179,212,0.7)',
                        boxShadow: '0 0 0 6px rgba(44,83,100,0.18), 0 0 32px rgba(90,179,212,0.25)',
                        fontSize: 40,
                        fontWeight: 800,
                        letterSpacing: '-1px',
                        color: 'rgba(255,255,255,0.9)',
                      }}
                    >
                      {initials}
                    </div>

                    {/* Username */}
                    <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[3px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      @{user.username}
                    </p>

                    {/* Role badge */}
                    <span
                      className="mt-3 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-[2px]"
                      style={{
                        background: 'rgba(44,83,100,0.35)',
                        border: '1px solid rgba(44,83,100,0.5)',
                        color: 'rgba(100,168,200,0.8)',
                      }}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* ── Right: Info & Edit ── */}
                  <div className="flex-1 p-8 sm:p-10 flex flex-col gap-6">

                    {/* Header row */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-white font-extrabold text-xl uppercase tracking-[1px] leading-tight">
                          {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.username}
                        </h2>
                        <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          Member since {new Date(user.createdAt ?? Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </p>
                      </div>
                      {!editing ? (
                        <button
                          onClick={() => setEditing(true)}
                          className="flex-shrink-0 px-5 py-2 rounded-[50px] text-[10px] font-extrabold uppercase tracking-[2px] transition-all duration-200 cursor-pointer"
                          style={{ background: 'rgba(44,83,100,0.35)', border: '1px solid rgba(44,83,100,0.55)', color: 'rgba(100,168,200,0.85)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(44,83,100,0.55)'; e.currentTarget.style.color = '#fff' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(44,83,100,0.35)'; e.currentTarget.style.color = 'rgba(100,168,200,0.85)' }}
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-5 py-2 rounded-[50px] text-[10px] font-extrabold uppercase tracking-[2px] text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364, #1a3340)' }}
                            onMouseEnter={e => { if (!saving) { e.currentTarget.style.boxShadow = '0 0 22px rgba(44,83,100,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
                          >
                            {saving ? 'Saving…' : 'Save Changes'}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="px-4 py-2 rounded-[50px] text-[10px] font-extrabold uppercase tracking-[2px] transition-all duration-200 cursor-pointer disabled:opacity-50"
                            style={{ color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent' }}
                            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

                    {/* Fields grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <Field label="First Name" name="firstName" value={editing ? form.firstName : user.firstName} editing={editing} onChange={handleChange} />
                      <Field label="Last Name"  name="lastName"  value={editing ? form.lastName  : user.lastName}  editing={editing} onChange={handleChange} />
                      <Field label="Email Address" name="email" value={editing ? form.email : user.email} editing={editing} onChange={handleChange} />
                      <Field label="Phone Number"  name="phone" value={editing ? form.phone : user.phone} editing={editing} onChange={handleChange} />
                    </div>

                    {/* Bottom action row */}
                    <div className="flex items-center justify-end mt-auto pt-2">
                      <button
                        onClick={() => setShowDelete(true)}
                        className="px-5 py-2 rounded-[50px] text-[10px] font-extrabold uppercase tracking-[2px] transition-all duration-200 cursor-pointer"
                        style={{ background: 'rgba(220,80,80,0.08)', border: '1px solid rgba(220,80,80,0.28)', color: 'rgba(220,80,80,0.72)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.22)'; e.currentTarget.style.borderColor = 'rgba(220,80,80,0.5)'; e.currentTarget.style.color = 'rgba(255,120,120,0.95)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,80,80,0.08)'; e.currentTarget.style.borderColor = 'rgba(220,80,80,0.28)'; e.currentTarget.style.color = 'rgba(220,80,80,0.72)' }}
                      >
                        Delete Account
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}
