import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/authService'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

const REQUIREMENTS = [
  { label: 'At least 8 characters',        test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',          test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter',          test: (p) => /[a-z]/.test(p) },
  { label: 'One number',                    test: (p) => /\d/.test(p) },
  { label: 'One special character',         test: (p) => /[^A-Za-z0-9]/.test(p) },
]

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword]         = useState('')
  const [confirm, setConfirm]           = useState('')
  const [status, setStatus]             = useState('idle') // idle | loading | success | expired | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) setStatus('error')
  }, [token])

  const passwordMeetsAll = REQUIREMENTS.every((r) => r.test(password))
  const passwordsMatch   = password === confirm && confirm.length > 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!passwordMeetsAll || !passwordsMatch) return

    setStatus('loading')
    setErrorMessage('')
    try {
      await resetPassword(token, password)
      setStatus('success')
    } catch (err) {
      if (err.status === 410) {
        setStatus('expired')
      } else {
        setStatus('error')
        setErrorMessage(err.message || 'Something went wrong. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-[#0F2027] p-5">
      <div
        className="w-full max-w-[460px] bg-[#0F2027] p-10 max-sm:p-7"
        style={{
          boxShadow: '0 0 0 3px #2C5364, 0 0 15px 3px rgba(44,83,100,0.6), 0 0 35px 8px rgba(44,83,100,0.3), 0 0 70px 15px rgba(44,83,100,0.1)',
        }}
      >
        {/* ── Logo / brand ── */}
        <div className="text-center mb-8">
          <img
            src="/LapTheWorld.svg"
            alt="LapTheWorld"
            className="inline-block h-16 w-auto"
          />
        </div>

        {/* ── Success ── */}
        {status === 'success' && (
          <div className="flex flex-col items-center text-center">
            <span className="text-[#5b8fa8] mb-4"><CheckIcon /></span>
            <h2 className="text-white text-xl font-bold tracking-[3px] uppercase mb-3">
              Password Updated
            </h2>
            <p className="text-white/50 text-[13px] leading-relaxed mb-8">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Button onClick={() => navigate('/')}>Go to Login</Button>
          </div>
        )}

        {/* ── Expired ── */}
        {status === 'expired' && (
          <div className="flex flex-col items-center text-center">
            <span className="text-amber-400/70 mb-4"><ClockIcon /></span>
            <h2 className="text-white text-xl font-bold tracking-[3px] uppercase mb-3">
              Link Expired
            </h2>
            <p className="text-white/50 text-[13px] leading-relaxed mb-8">
              This reset link has expired. Reset links are only valid for&nbsp;
              <span className="text-white/70">15 minutes</span>.
              Please request a new one.
            </p>
            <Button onClick={() => navigate('/')}>Request New Link</Button>
          </div>
        )}

        {/* ── Invalid token (no token in URL) ── */}
        {status === 'error' && !errorMessage && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-white text-xl font-bold tracking-[3px] uppercase mb-3">
              Invalid Link
            </h2>
            <p className="text-white/50 text-[13px] leading-relaxed mb-8">
              This reset link is invalid or has already been used.
              Please request a new one from the login page.
            </p>
            <Button onClick={() => navigate('/')}>Back to Login</Button>
          </div>
        )}

        {/* ── Form ── */}
        {(status === 'idle' || status === 'loading' || (status === 'error' && errorMessage)) && token && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-white text-2xl font-bold tracking-[3px] uppercase mb-2">
              New Password
            </h2>
            <p className="text-white/40 text-[13px] leading-relaxed mb-7">
              Choose a strong password for your account.
            </p>

            <InputField
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              icon={<LockIcon />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputField
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              icon={<LockIcon />}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {/* Password requirements checklist */}
            {password.length > 0 && (
              <ul className="mb-5 space-y-1">
                {REQUIREMENTS.map((r) => (
                  <li
                    key={r.label}
                    className={`flex items-center gap-2 text-[12px] transition-colors duration-200 ${
                      r.test(password) ? 'text-emerald-400/80' : 'text-white/30'
                    }`}
                  >
                    <span className="inline-block w-3 h-3 shrink-0">
                      {r.test(password) ? (
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                          <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/>
                          <path d="M3.5 6l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                          <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                      )}
                    </span>
                    {r.label}
                  </li>
                ))}
              </ul>
            )}

            {/* Confirm mismatch */}
            {confirm.length > 0 && !passwordsMatch && (
              <p className="text-red-400/70 text-[12px] mt-[-16px] mb-4 pl-1">
                Passwords do not match
              </p>
            )}

            {/* Generic error */}
            {status === 'error' && errorMessage && (
              <p className="text-red-400/80 text-[12px] mb-4 pl-1">{errorMessage}</p>
            )}

            <Button
              type="submit"
              disabled={status === 'loading' || !passwordMeetsAll || !passwordsMatch}
            >
              {status === 'loading' ? 'Resetting…' : 'Reset Password'}
            </Button>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-transparent border-0 text-white/25 text-[12px] font-[inherit] cursor-pointer p-0 hover:text-white/50 transition-colors duration-200"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
