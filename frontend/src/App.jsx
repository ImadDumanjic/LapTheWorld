import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AudioProvider } from './context/AudioContext'
import WelcomePage from './pages/WelcomePage'
import AuthPage from './pages/AuthPage'
import LandingPage from './pages/LandingPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ChampionshipPage from './pages/ChampionshipPage'
import CalendarPage from './pages/CalendarPage'
import BlogPage from './pages/BlogPage'
import ProfilePage from './pages/ProfilePage'
import TravelGuidePage from './pages/TravelGuidePage'
import RaceWeekendLandingPage from './pages/RaceWeekendLandingPage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'
import MyBlogsPage from './pages/MyBlogsPage'
import Header from './components/layout/Header'

const HIDE_HEADER_ON = ['/', '/auth', '/landing', '/reset-password', '/admin-login', '/admin']

function authState() {
  return {
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),
  }
}

function NonAdminRoute({ children }) {
  const { token, role } = authState()
  if (token && role === 'Admin') return <Navigate to="/admin" replace />
  return children
}

function AdminLoginRoute({ children }) {
  const { token, role } = authState()
  if (token && role === 'Admin') return <Navigate to="/admin" replace />
  if (token && role === 'User') return <Navigate to="/landing" replace />
  return children
}

function AdminRoute({ children }) {
  const { token, role } = authState()
  if (!token) return <Navigate to="/admin-login" replace />
  if (role !== 'Admin') return <Navigate to="/landing" replace />
  return children
}

function Layout() {
  const { pathname } = useLocation()
  const showHeader = !HIDE_HEADER_ON.includes(pathname)

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<NonAdminRoute><WelcomePage /></NonAdminRoute>} />
        <Route path="/auth" element={<NonAdminRoute><AuthPage /></NonAdminRoute>} />
        <Route path="/landing" element={<NonAdminRoute><LandingPage /></NonAdminRoute>} />
        <Route path="/reset-password" element={<NonAdminRoute><ResetPasswordPage /></NonAdminRoute>} />
        <Route path="/championship" element={<NonAdminRoute><ChampionshipPage /></NonAdminRoute>} />
        <Route path="/calendar" element={<NonAdminRoute><CalendarPage /></NonAdminRoute>} />
        <Route path="/blog" element={<NonAdminRoute><BlogPage /></NonAdminRoute>} />
        <Route path="/profile" element={<NonAdminRoute><ProfilePage /></NonAdminRoute>} />
        <Route path="/travel-guide" element={<NonAdminRoute><RaceWeekendLandingPage /></NonAdminRoute>} />
        <Route path="/travel-guide/:slug" element={<NonAdminRoute><TravelGuidePage /></NonAdminRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin-login" element={<AdminLoginRoute><AdminLoginPage /></AdminLoginRoute>} />
        <Route path="/blog/my" element={<NonAdminRoute><MyBlogsPage /></NonAdminRoute>} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AudioProvider>
        <Layout />
      </AudioProvider>
    </BrowserRouter>
  )
}
