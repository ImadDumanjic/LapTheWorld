import { useState } from 'react'
import { requestPasswordReset } from '../../services/authService'
import InputField from '../ui/InputField'
import Button from '../ui/Button'

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
)

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMessage('')
    try {
      await requestPasswordReset(email.trim())
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-[420px] bg-[#0F2027] p-8 rounded-sm"
        style={{
          boxShadow: '0 0 0 2px #2C5364, 0 0 20px 4px rgba(44,83,100,0.5), 0 0 50px 12px rgba(44,83,100,0.2)',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/70 transition-colors duration-200"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {status === 'success' ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center text-center py-4">
            <span className="text-[#5b8fa8] mb-4">
              <CheckIcon />
            </span>
            <h3 className="text-white text-lg font-bold tracking-[2px] uppercase mb-3">
              Check Your Email
            </h3>
            <p className="text-white/50 text-[13px] leading-relaxed mb-6">
              If that email address is registered, we&apos;ve sent a reset link to it.
              The link expires in&nbsp;<span className="text-white/70">15 minutes</span>.
            </p>
            <p className="text-white/30 text-[11px] mb-6">
              Don&apos;t see it? Check your spam folder.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="text-[#5b8fa8] text-[13px] hover:underline hover:text-[#7ab3c8] transition-colors duration-200"
            >
              Back to login
            </button>
          </div>
        ) : (
          /* ── Email input state ── */
          <form onSubmit={handleSubmit}>
            <h3 className="text-white text-xl font-bold tracking-[3px] uppercase mb-2">
              Forgot Password
            </h3>
            <p className="text-white/40 text-[13px] leading-relaxed mb-7">
              Enter your account email and we&apos;ll send you a reset link.
            </p>

            <InputField
              type="email"
              placeholder="Email address"
              autoComplete="email"
              icon={<EmailIcon />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {status === 'error' && (
              <p className="text-red-400/80 text-[12px] mt-[-12px] mb-4 pl-1">
                {errorMessage}
              </p>
            )}

            <Button type="submit" disabled={status === 'loading' || !email.trim()}>
              {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
            </Button>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={onClose}
                className="bg-transparent border-0 text-white/25 text-[12px] font-[inherit] cursor-pointer p-0 hover:text-white/50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
