import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ChampionshipPage from './pages/ChampionshipPage'
import CalendarPage from './pages/CalendarPage'
import BlogPage from './pages/BlogPage'
import Header from './components/layout/Header'

const HIDE_HEADER_ON = ['/', '/landing', '/reset-password']

function Layout() {
  const { pathname } = useLocation()
  const showHeader = !HIDE_HEADER_ON.includes(pathname)

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/championship" element={<ChampionshipPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
