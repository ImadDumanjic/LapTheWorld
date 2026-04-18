import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import InputField from '../ui/InputField'
import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'
import ForgotPasswordModal from './ForgotPasswordModal'

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
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

export default function LoginForm({ onSwitch, isRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ email, password })
      setEmail('')
      setPassword('')
      toast.success('Welcome back!')
      navigate('/landing')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center z-[5] pl-[100px] pr-11 max-sm:relative max-sm:w-full max-sm:h-auto max-sm:top-auto max-sm:left-auto max-sm:px-7 max-sm:py-[52px] ${
          isRegister
            ? 'opacity-0 pointer-events-none [transition:opacity_0.25s_ease-in-out] max-sm:hidden'
            : 'opacity-100 pointer-events-auto [transition:opacity_0.25s_ease-in-out_0.3s]'
        }`}
      >
        <h2 className="text-white text-2xl font-bold tracking-[3px] uppercase mb-[30px]">Login</h2>

        <InputField
          type="email"
          placeholder="Email"
          autoComplete="email"
          icon={<EmailIcon />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type={showPw ? 'text' : 'password'}
          placeholder="Password"
          autoComplete="current-password"
          icon={<LockIcon />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightPad="pr-[132px]"
          action={
            <span className="flex items-center gap-2 pr-[2px]">
              <button
                type="button"
                className="bg-transparent border-0 text-white/35 cursor-pointer p-0 flex items-center transition-colors duration-200 hover:text-white/70"
                onClick={() => setShowPw(v => !v)}
                tabIndex={-1}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                <EyeIcon show={showPw} />
              </button>
              <button
                type="button"
                className="bg-transparent border-0 text-[#5b8fa8] opacity-60 text-[11px] font-[inherit] cursor-pointer p-0 whitespace-nowrap transition-opacity duration-200 hover:opacity-100 hover:underline"
                onClick={() => setShowForgotModal(true)}
              >
                Forgot password?
              </button>
            </span>
          }
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </Button>

        <p className="text-white/40 text-[13px] mt-5 text-center">
          Don't have an account?{' '}
          <button
            type="button"
            className="bg-transparent border-0 text-[#5b8fa8] cursor-pointer text-[13px] font-[inherit] p-0 transition-colors duration-200 hover:text-[#7ab3c8] hover:underline"
            onClick={onSwitch}
          >
            Sign Up
          </button>
        </p>
        <div className="text-[12px] text-white/25 mt-[14px] tracking-wider">── or ──</div>
        <button
          type="button"
          className="bg-transparent border-0 text-[#5b8fa8] opacity-70 text-[13px] font-[inherit] cursor-pointer p-0 mt-[17px] ml-[7px] transition-opacity duration-200 hover:opacity-100"
          onClick={() => navigate('/landing')}
        >
          Continue as Guest →
        </button>
      </form>

      {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />}
    </>
  )
}
