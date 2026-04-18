import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import InputField from '../ui/InputField'
import PhoneInputField from '../ui/PhoneInputField'
import Button from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
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

export default function RegisterForm({ onSwitch, isRegister }) {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({
    username: '', email: '', password: '', firstName: '', lastName: '', phone: '',
  })
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  const setPhone = (value) => setForm((prev) => ({ ...prev, phone: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(form)
      setForm({ username: '', email: '', password: '', firstName: '', lastName: '', phone: '' })
      toast.success('Account created! Please sign in.')
      onSwitch()
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center z-[5] pl-[72px] pr-9 max-sm:relative max-sm:w-full max-sm:h-auto max-sm:top-auto max-sm:right-auto max-sm:px-7 max-sm:py-[52px] ${
        isRegister
          ? 'opacity-100 pointer-events-auto [transition:opacity_0.25s_ease-in-out_0.3s]'
          : 'opacity-0 pointer-events-none [transition:opacity_0.25s_ease-in-out] max-sm:hidden'
      }`}
    >
      <h2 className="text-white text-2xl font-bold tracking-[3px] uppercase mb-[30px]">Register</h2>

      <InputField type="email"    placeholder="Email"    autoComplete="email"        icon={<MailIcon />} value={form.email}    onChange={set('email')} />
      <InputField
        type={showPw ? 'text' : 'password'}
        placeholder="Password"
        autoComplete="new-password"
        icon={<LockIcon />}
        value={form.password}
        onChange={set('password')}
        action={
          <button
            type="button"
            className="bg-transparent border-0 text-white/35 cursor-pointer p-0 pr-[2px] flex items-center transition-colors duration-200 hover:text-white/70"
            onClick={() => setShowPw(v => !v)}
            tabIndex={-1}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            <EyeIcon show={showPw} />
          </button>
        }
      />

      <div className="flex gap-[14px] w-full">
        <InputField type="text" placeholder="First Name" autoComplete="given-name"  icon={<UserIcon />}  value={form.firstName} onChange={set('firstName')} />
        <InputField type="text" placeholder="Last Name"  autoComplete="family-name" icon={<UserIcon />}  value={form.lastName}  onChange={set('lastName')} />
      </div>
      <div className="flex gap-[14px] w-full">
        <InputField type="text" placeholder="Username" autoComplete="username" icon={<UserIcon />} value={form.username} onChange={set('username')} />
        <PhoneInputField value={form.phone} onChange={setPhone} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Register'}
      </Button>

      <p className="text-white/40 text-[13px] mt-5 text-center">
        Already have an account?{' '}
        <button
          type="button"
          className="bg-transparent border-0 text-[#5b8fa8] cursor-pointer text-[13px] font-[inherit] p-0 transition-colors duration-200 hover:text-[#7ab3c8] hover:underline"
          onClick={onSwitch}
        >
          Sign In
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
  )
}
