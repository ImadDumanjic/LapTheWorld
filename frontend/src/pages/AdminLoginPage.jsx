import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import InputField from '../components/ui/InputField'
import Button from '../components/ui/Button'
import { adminLogin, adminVerifyTotp, adminConfirmTotpSetup } from '../services/authService'

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const EyeIcon = ({ show }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    {show
      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
    }
  </svg>
)
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

export default function AdminLoginPage() {
  const navigate = useNavigate()
  // step: 'credentials' | 'totp' | 'setup'
  const [step, setStep]           = useState('credentials')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [code, setCode]           = useState('')
  const [tempToken, setTempToken] = useState('')
  const [setupData, setSetupData] = useState(null)   // { qrDataUrl, manualSecret }
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const clearError = () => setError('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (token && role === 'Admin') navigate('/admin', { replace: true })
    if (token && role === 'User') navigate('/landing', { replace: true })
  }, [navigate])

  const reset = () => {
    setStep('credentials')
    setCode('')
    setError('')
    setTempToken('')
    setSetupData(null)
  }

  // ── Step 1: email + password ───────────────────────────────────────────────
  const handleCredentials = async (e) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      const res = await adminLogin({ email, password })
      setTempToken(res.tempToken)
      if (res.requiresSetup) {
        setSetupData({ qrDataUrl: res.qrDataUrl, manualSecret: res.manualSecret })
        setStep('setup')
      } else {
        setStep('totp')
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2a: verify TOTP ───────────────────────────────────────────────────
  const handleVerifyTotp = async (e) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      const res = await adminVerifyTotp({ tempToken, totpCode: code })
      localStorage.setItem('token', res.token)
      localStorage.setItem('role', 'Admin')
      toast.success('Access granted')
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Invalid code')
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2b: confirm first-time setup ────────────────────────────────────
  const handleConfirmSetup = async (e) => {
    e.preventDefault()
    clearError()
    setLoading(true)
    try {
      const res = await adminConfirmTotpSetup({ tempToken, totpCode: code })
      localStorage.setItem('token', res.token)
      localStorage.setItem('role', 'Admin')
      toast.success('Authenticator configured. Access granted.')
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Invalid code')
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  const codeInput = (onSubmit) => (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      maxLength={6}
      placeholder="000 000"
      value={code}
      onChange={e => { setCode(e.target.value.replace(/\D/g, '')); clearError() }}
      onKeyDown={e => { if (e.key === 'Enter' && code.length === 6) onSubmit(e) }}
      autoFocus
      className="w-full bg-transparent border-0 border-b border-b-white/[0.18] py-3 text-center text-white text-[2rem] font-bold tracking-[0.6em] outline-none transition-[border-color] duration-[250ms] placeholder:text-white/15 focus:border-b-[#2C5364] mb-6"
    />
  )

  const backLink = (
    <button type="button" onClick={reset}
      className="bg-transparent border-0 text-[#5b8fa8] opacity-60 text-[12px] font-[inherit] cursor-pointer p-0 mt-4 transition-opacity duration-200 hover:opacity-100"
    >
      ← Back to login
    </button>
  )

  return (
    <div className="min-h-svh flex items-center justify-center bg-[#0F2027] p-5">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a3340', color: '#fff' } }} />

      <div
        className="w-[440px] max-w-full bg-[#0F2027] px-10 py-12 flex flex-col items-center"
        style={{
          boxShadow:
            '0 0 0 3px #2C5364, 0 0 15px 3px rgba(44,83,100,0.6), 0 0 35px 8px rgba(44,83,100,0.3), 0 0 70px 15px rgba(44,83,100,0.1)',
        }}
      >
        {/* Branding */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <img src="/LapTheWorld.svg" alt="LapTheWorld" style={{ height: 44 }} />
          <span className="text-[10px] font-bold tracking-[4px] uppercase" style={{ color: '#2C5364' }}>
            Admin Portal
          </span>
        </div>

        {/* ── Step: credentials ───────────────────────────────────────────── */}
        {step === 'credentials' && (
          <form onSubmit={handleCredentials} className="w-full flex flex-col items-center">
            <h2 className="text-white text-xl font-bold tracking-[3px] uppercase mb-7">Admin Login</h2>

            <InputField
              type="email"
              placeholder="Email"
              autoComplete="email"
              icon={<EmailIcon />}
              value={email}
              onChange={e => { setEmail(e.target.value); clearError() }}
            />

            <InputField
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              icon={<LockIcon />}
              value={password}
              onChange={e => { setPassword(e.target.value); clearError() }}
              rightPad="pr-10"
              action={
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="bg-transparent border-0 text-white/35 cursor-pointer p-0 pr-[2px] flex items-center transition-colors duration-200 hover:text-white/70"
                  onClick={() => setShowPw(v => !v)}
                >
                  <EyeIcon show={showPw} />
                </button>
              }
            />

            {error && <p className="text-red-400 text-[12px] mb-3 self-start">{error}</p>}

            <Button type="submit" disabled={loading || !email || !password}>
              {loading ? 'Verifying…' : 'Continue →'}
            </Button>
          </form>
        )}

        {/* ── Step: TOTP verification ──────────────────────────────────────── */}
        {step === 'totp' && (
          <form onSubmit={handleVerifyTotp} className="w-full flex flex-col items-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-5"
              style={{ background: 'rgba(44,83,100,0.2)', border: '1px solid rgba(44,83,100,0.45)', color: '#5b8fa8' }}
            >
              <ShieldIcon />
            </div>

            <h2 className="text-white text-xl font-bold tracking-[3px] uppercase mb-2">Verify Identity</h2>
            <p className="text-white/40 text-[13px] mb-7 text-center leading-relaxed">
              Enter the 6-digit code from your authenticator app
            </p>

            {codeInput(handleVerifyTotp)}

            {error && <p className="text-red-400 text-[12px] mb-3 self-start">{error}</p>}

            <Button type="submit" disabled={loading || code.length < 6}>
              {loading ? 'Verifying…' : 'Verify Code'}
            </Button>
            {backLink}
          </form>
        )}

        {/* ── Step: first-time TOTP setup ──────────────────────────────────── */}
        {step === 'setup' && (
          <form onSubmit={handleConfirmSetup} className="w-full flex flex-col items-center">
            <h2 className="text-white text-xl font-bold tracking-[3px] uppercase mb-2">Set Up Authenticator</h2>
            <p className="text-white/40 text-[13px] mb-6 text-center leading-relaxed">
              Scan the QR code with Google Authenticator, Authy, or any TOTP app, then enter the code to confirm.
            </p>

            {setupData?.qrDataUrl && (
              <div className="p-3 bg-white rounded mb-5 flex-shrink-0">
                <img src={setupData.qrDataUrl} alt="TOTP QR code" style={{ width: 180, height: 180, display: 'block' }} />
              </div>
            )}

            <details className="w-full mb-6 cursor-pointer group">
              <summary className="text-[#5b8fa8] text-[12px] opacity-60 transition-opacity duration-200 group-hover:opacity-100 list-none">
                Can't scan? Enter the key manually ↓
              </summary>
              <code className="block mt-2 text-[11px] text-white/35 break-all tracking-widest leading-relaxed">
                {setupData?.manualSecret}
              </code>
            </details>

            <p className="text-white/35 text-[11px] mb-3 self-start tracking-wider uppercase">
              Confirm with a code from the app
            </p>
            {codeInput(handleConfirmSetup)}

            {error && <p className="text-red-400 text-[12px] mb-3 self-start">{error}</p>}

            <Button type="submit" disabled={loading || code.length < 6}>
              {loading ? 'Activating…' : 'Activate & Sign In'}
            </Button>
            {backLink}
          </form>
        )}
      </div>
    </div>
  )
}
