import { useState } from 'react'
import './App.css'

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

export default function App() {
  const [isRegister, setIsRegister] = useState(false)

  return (
    <div className="auth-bg">
      <div className={`auth-card${isRegister ? ' register-mode' : ''}`}>

        {/* ── Login Form ── */}
        <div className="form-panel login-panel">
          <h2>Login</h2>

          <div className="input-group">
            <span className="input-icon"><UserIcon /></span>
            <input type="text" placeholder="Username" autoComplete="username" />
          </div>

          <div className="input-group">
            <span className="input-icon"><LockIcon /></span>
            <input type="password" placeholder="Password" autoComplete="current-password" />
          </div>

          <button className="btn-auth">Login</button>

          <p className="switch-text">
            Don't have an account?{' '}
            <button className="link-btn" onClick={() => setIsRegister(true)}>Sign Up</button>
          </p>
          <div className="guest-divider">── or ──</div>
          <button className="guest-btn">Continue as Guest →</button>
        </div>

        {/* ── Register Form ── */}
        <div className="form-panel register-panel">
          <h2>Register</h2>

          <div className="input-group">
            <span className="input-icon"><UserIcon /></span>
            <input type="text" placeholder="Username" autoComplete="username" />
          </div>

          <div className="input-group">
            <span className="input-icon"><MailIcon /></span>
            <input type="email" placeholder="Email" autoComplete="email" />
          </div>

          <div className="input-group">
            <span className="input-icon"><LockIcon /></span>
            <input type="password" placeholder="Password" autoComplete="new-password" />
          </div>

          <div className="name-row">
            <div className="input-group">
              <span className="input-icon"><UserIcon /></span>
              <input type="text" placeholder="First Name" autoComplete="given-name" />
            </div>
            <div className="input-group">
              <span className="input-icon"><UserIcon /></span>
              <input type="text" placeholder="Last Name" autoComplete="family-name" />
            </div>
          </div>

          <button className="btn-auth">Register</button>

          <p className="switch-text">
            Already have an account?{' '}
            <button className="link-btn" onClick={() => setIsRegister(false)}>Sign In</button>
          </p>
          <div className="guest-divider">── or ──</div>
          <button className="guest-btn">Continue as Guest →</button>
        </div>

        {/* ── Sliding Teal Panel ── */}
        <div className="overlay">
          <div className="overlay-content login-content">
            <h3>Welcome Back</h3>
            <p>Sign in to continue your journey</p>
          </div>
          <div className="overlay-content register-content">
            <h3>Join the Grid</h3>
            <p>Create your account and start planning your ultimate race weekend</p>
          </div>
        </div>

      </div>
    </div>
  )
}
