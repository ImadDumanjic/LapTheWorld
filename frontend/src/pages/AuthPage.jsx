import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import OverlayPanel from '../components/auth/OverlayPanel'

export default function AuthPage() {
  const location = useLocation()
  const [isRegister, setIsRegister] = useState(
    location.state?.showRegister === true
  )

  return (
    <div className="min-h-svh flex items-center justify-center bg-[#0F2027] p-5">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a3340', color: '#fff' } }} />
      <div
        className="relative w-[1080px] max-w-full h-[560px] max-sm:h-auto overflow-hidden bg-[#0F2027]"
        style={{
          boxShadow: '0 0 0 3px #2C5364, 0 0 15px 3px rgba(44,83,100,0.6), 0 0 35px 8px rgba(44,83,100,0.3), 0 0 70px 15px rgba(44,83,100,0.1)',
        }}
      >
        <LoginForm onSwitch={() => setIsRegister(true)}  isRegister={isRegister} />
        <RegisterForm onSwitch={() => setIsRegister(false)} isRegister={isRegister} />
        <OverlayPanel isRegister={isRegister} />
      </div>
    </div>
  )
}
