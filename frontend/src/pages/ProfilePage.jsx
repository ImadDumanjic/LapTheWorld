import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { fetchProfile, updateProfile, deleteAccount, getTokenUserId, verifyCurrentPassword, changePassword as changePasswordService } from '../services/userService'
import { logout } from '../services/authService'

// ─── Password strength helpers ────────────────────────────────────────────────

function pwStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

function pwStrengthLabel(score) {
  if (score <= 1) return { label: 'Very Weak', color: '#e74c3c' }
  if (score === 2) return { label: 'Weak',      color: '#e67e22' }
  if (score === 3) return { label: 'Fair',       color: '#f1c40f' }
  if (score === 4) return { label: 'Strong',     color: '#2ecc71' }
  return               { label: 'Very Strong', color: '#5ab3d4' }
}

// ─── Module-scope sub-components (never defined inside a parent render) ─────────

function EyeIcon({ show }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  )
}

function PwInput({ value, onChange, show, onToggle, placeholder, autoFocus, disabled, verified, onEnter }) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        className="w-full rounded-xl px-4 py-3 text-[13px] text-white outline-none transition-all duration-200"
        style={{
          background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${disabled ? 'rgba(44,83,100,0.25)' : 'rgba(44,83,100,0.45)'}`,
          paddingRight: 42,
          opacity: disabled ? 0.7 : 1,
          cursor: disabled ? 'default' : 'text',
        }}
        onFocus={e => { if (!disabled) { e.currentTarget.style.borderColor = 'rgba(90,179,212,0.65)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(44,83,100,0.18)' } }}
        onBlur={e => { e.currentTarget.style.borderColor = disabled ? 'rgba(44,83,100,0.25)' : 'rgba(44,83,100,0.45)'; e.currentTarget.style.boxShadow = '' }}
        onKeyDown={e => { if (e.key === 'Enter' && onEnter && !disabled) onEnter() }}
      />
      {verified ? (
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#2ecc71' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: disabled ? 'default' : 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}
          onMouseEnter={e => { if (!disabled) e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
        >
          <EyeIcon show={show} />
        </button>
      )}
    </div>
  )
}

// ─── Change Password Modal ─────────────────────────────────────────────────────

function ChangePasswordModal({ userId, onSuccess, onCancel }) {
  const [step, setStep]               = useState(1)
  const [currentPw, setCurrentPw]     = useState('')
  const [newPw, setNewPw]             = useState('')
  const [confirmPw, setConfirmPw]     = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')

  const strength     = pwStrength(newPw)
  const strengthInfo = pwStrengthLabel(strength)
  const pwRules      = [
    { label: '8+ characters',    ok: newPw.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(newPw) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(newPw) },
    { label: 'Number',           ok: /\d/.test(newPw) },
    { label: 'Special character',ok: /[^A-Za-z0-9]/.test(newPw) },
  ]

  const handleVerify = async () => {
    if (!currentPw) { setError('Please enter your current password'); return }
    setLoading(true); setError('')
    try {
      await verifyCurrentPassword(userId, currentPw)
      setStep(2)
    } catch (err) {
      setError(err.message || 'Incorrect password')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = async () => {
    if (!newPw) { setError('Please enter a new password'); return }
    if (newPw !== confirmPw) { setError('Passwords do not match'); return }
    if (strength < 5) { setError('Password must meet all requirements'); return }
    setLoading(true); setError('')
    try {
      await changePasswordService(userId, currentPw, newPw)
      onSuccess()
    } catch (err) {
      setError(err.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-[440px] rounded-2xl p-8"
        style={{
          background: '#0F2027',
          border: '1px solid rgba(44,83,100,0.45)',
          boxShadow: '0 0 0 1px rgba(44,83,100,0.15), 0 0 40px rgba(44,83,100,0.18), 0 24px 60px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onCancel}
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
          style={{ background: 'linear-gradient(135deg, rgba(44,83,100,0.4), rgba(15,32,39,0.5))', border: '1px solid rgba(90,179,212,0.25)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(90,179,212,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        {/* Step indicator */}
        <p className="text-[10px] font-extrabold tracking-[3.5px] uppercase mb-2" style={{ color: 'rgba(90,179,212,0.7)' }}>
          Step {step} of 2
        </p>

        <h2 className="font-extrabold uppercase leading-tight mb-1" style={{ fontSize: 20, color: '#fff', letterSpacing: '0.5px' }}>
          {step === 1 ? 'Verify Identity' : 'Set New Password'}
        </h2>
        <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.38)' }}>
          {step === 1
            ? 'Enter your current password to continue.'
            : 'Choose a strong new password for your account.'}
        </p>

        {/* Stable field container — current password is ALWAYS at this position in the tree */}
        <div className="flex flex-col gap-4">
          <PwInput
            value={currentPw}
            onChange={setCurrentPw}
            show={showCurrent}
            onToggle={() => setShowCurrent(v => !v)}
            placeholder="Current password"
            autoFocus={step === 1}
            disabled={step === 2}
            verified={step === 2}
            onEnter={handleVerify}
          />

          {/* Step 2 fields — rendered below the stable current-pw input */}
          {step === 2 && (
            <>
              <PwInput
                value={newPw}
                onChange={v => { setNewPw(v); setError('') }}
                show={showNew}
                onToggle={() => setShowNew(v => !v)}
                placeholder="New password"
                autoFocus
                onEnter={handleChange}
              />

              {newPw.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthInfo.color : 'rgba(255,255,255,0.08)', transition: 'background 0.2s' }} />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: strengthInfo.color }}>{strengthInfo.label}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1">
                {pwRules.map(r => (
                  <div key={r.label} className="flex items-center gap-1.5">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: r.ok ? '#2ecc71' : 'rgba(255,255,255,0.18)', flexShrink: 0, transition: 'background 0.2s' }} />
                    <span className="text-[11px]" style={{ color: r.ok ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.3)' }}>{r.label}</span>
                  </div>
                ))}
              </div>

              <PwInput
                value={confirmPw}
                onChange={setConfirmPw}
                show={showConfirm}
                onToggle={() => setShowConfirm(v => !v)}
                placeholder="Confirm new password"
                onEnter={handleChange}
              />
              {confirmPw.length > 0 && newPw !== confirmPw && (
                <p className="text-[11px]" style={{ color: '#e74c3c', marginTop: -8 }}>Passwords do not match</p>
              )}
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-[12px] mt-4 px-3 py-2 rounded-lg" style={{ color: '#e74c3c', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)' }}>
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={step === 1 ? handleVerify : handleChange}
            disabled={loading}
            className="w-full py-3 rounded-[50px] text-white text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-200 cursor-pointer disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364, #1a3340)' }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 0 28px rgba(44,83,100,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
          >
            {loading ? (step === 1 ? 'Verifying…' : 'Saving…') : (step === 1 ? 'Continue →' : 'Update Password')}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-[50px] text-[11px] font-extrabold uppercase tracking-[2px] transition-all duration-200 cursor-pointer"
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
  const [showDelete, setShowDelete]               = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const handlePasswordChangeSuccess = () => {
    setShowChangePassword(false)
    fetchProfile().then(data => setUser(data)).catch(() => {})
    toast.success('Password updated successfully')
  }

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

      {showChangePassword && (
        <ChangePasswordModal
          userId={getTokenUserId()}
          onSuccess={handlePasswordChangeSuccess}
          onCancel={() => setShowChangePassword(false)}
        />
      )}

      {/* Page background */}
      <div
        className="min-h-svh px-6 sm:px-12 pb-10 flex flex-col items-center"
        style={{
          paddingTop: 135,
          background: 'linear-gradient(160deg, #0F2027 0%, #203A43 50%, #2C5364 100%)'
        }}
      >
        <div className="w-full max-w-[1200px]">

          {/* Page heading */}
          <div className="mb-8">
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

          {/* Profile card + Danger Zone */}
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
                        {user.passwordChangedAt && (
                          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(90,179,212,0.5)' }}>
                            Password changed {new Date(user.passwordChangedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                      {editing && (
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

                    {/* Bottom button row — hidden while editing */}
                    {!editing && (
                      <>
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                        <div className="flex items-center justify-end gap-3">
                          {/* Change Password */}
                          <button
                            onClick={() => setShowChangePassword(true)}
                            className="flex items-center gap-2 px-5 py-2 rounded-[50px] text-[10px] font-extrabold uppercase tracking-[2px] transition-all duration-200 cursor-pointer"
                            style={{ background: 'transparent', border: 'none', boxShadow: 'inset 0 0 0 1.5px rgba(90,179,212,0.65)', color: 'rgba(100,168,200,0.85)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(44,83,100,0.2)'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1.5px rgba(90,179,212,1)'; e.currentTarget.style.color = '#fff' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'inset 0 0 0 1.5px rgba(90,179,212,0.65)'; e.currentTarget.style.color = 'rgba(100,168,200,0.85)' }}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Change Password
                          </button>
                          {/* Edit Profile */}
                          <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 px-5 py-2 rounded-[50px] text-[10px] font-extrabold uppercase tracking-[2px] text-white transition-all duration-200 cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #3d7a96, #2C5364, #1a3340)' }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 22px rgba(44,83,100,0.55)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
                          >
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit Profile
                          </button>
                        </div>
                      </>
                    )}

                  </div>
                </div>
              </div>

              {/* ── Danger Zone card ── */}
              <div
                className="w-full rounded-2xl overflow-hidden mt-6"
                style={{
                  position: 'relative',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(200,50,50,0.28)',
                  boxShadow: '0 0 0 1px rgba(200,50,50,0.08), 0 16px 40px rgba(0,0,0,0.35)',
                }}
              >
                {/* Hazard stripe — left edge */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: 7,
                    background: 'repeating-linear-gradient(-45deg, rgba(255,200,0,0.45) 0px, rgba(255,200,0,0.45) 5px, rgba(0,0,0,0.35) 5px, rgba(0,0,0,0.35) 10px)',
                  }}
                />

                <div className="flex items-center justify-between gap-6 px-10 py-7" style={{ paddingLeft: 'calc(7px + 2.5rem)' }}>
                  {/* Left: labels + description */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[9px] font-extrabold tracking-[3.5px] uppercase flex items-center gap-1.5" style={{ color: 'rgba(220,80,80,0.75)' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      Danger Zone &nbsp;·&nbsp; LapTheWorld Exit
                    </p>
                    <h3
                      className="font-extrabold uppercase leading-tight"
                      style={{ fontSize: 'clamp(14px,2vw,18px)', color: '#fff', letterSpacing: '0.5px' }}
                    >
                      Delete Account
                    </h3>
                    <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)', maxWidth: 480 }}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>

                  {/* Right: button */}
                  <button
                    onClick={() => setShowDelete(true)}
                    className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-[50px] text-[10px] font-extrabold uppercase tracking-[2px] transition-all duration-200 cursor-pointer"
                    style={{ background: 'transparent', border: '1px solid rgba(200,50,50,0.45)', color: 'rgba(220,80,80,0.8)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,57,43,0.18)'; e.currentTarget.style.borderColor = 'rgba(220,80,80,0.65)'; e.currentTarget.style.color = 'rgba(255,120,120,0.95)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(200,50,50,0.45)'; e.currentTarget.style.color = 'rgba(220,80,80,0.8)' }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                    Delete Account
                  </button>
                </div>
              </div>

            </>
          )}

        </div>
      </div>
    </>
  )
}
