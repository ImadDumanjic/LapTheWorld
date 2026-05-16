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
import CustomPlanPage from './pages/CustomPlanPage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'
import MyBlogsPage from './pages/MyBlogsPage'
import LiveTimingPage from './pages/LiveTimingPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import Header from './components/layout/Header'
import LegalFooter from './components/ui/LegalFooter'
import CookieConsentBanner from './components/ui/CookieConsentBanner'

const HIDE_HEADER_ON = ['/', '/auth', '/landing', '/reset-password', '/admin-login', '/admin', '/custom-plan']
const HIDE_FOOTER_ON = ['/', '/auth', '/landing', '/admin', '/admin-login']

function authState() {
  return {
    userId: localStorage.getItem('userId'),
    role: localStorage.getItem('role'),
    // Admin keeps its own token in localStorage for its Bearer-header auth flow
    adminToken: localStorage.getItem('token'),
  }
}

function NonAdminRoute({ children }) {
  const { userId, role } = authState()
  if (userId && role === 'Admin') return <Navigate to="/admin" replace />
  return children
}

function AdminLoginRoute({ children }) {
  const { adminToken, role } = authState()
  if (adminToken && role === 'Admin') return <Navigate to="/admin" replace />
  if (adminToken && role === 'User') return <Navigate to="/landing" replace />
  return children
}

function AdminRoute({ children }) {
  const { adminToken, role } = authState()
  if (!adminToken) return <Navigate to="/admin-login" replace />
  if (role !== 'Admin') return <Navigate to="/landing" replace />
  return children
}

function Layout() {
  const { pathname } = useLocation()
  const showHeader = !HIDE_HEADER_ON.includes(pathname)
  const showFooter = !HIDE_FOOTER_ON.includes(pathname)

  return (
    <div className="bg-page-gradient">
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
        <Route path="/custom-plan" element={<CustomPlanPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin-login" element={<AdminLoginRoute><AdminLoginPage /></AdminLoginRoute>} />
        <Route path="/blog/my" element={<NonAdminRoute><MyBlogsPage /></NonAdminRoute>} />
        <Route path="/live-timing" element={<NonAdminRoute><LiveTimingPage /></NonAdminRoute>} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
      {showFooter && <LegalFooter />}
      <CookieConsentBanner />
    </div>
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
