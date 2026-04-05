import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  )
}
