import { Routes, Route, Link, NavLink } from 'react-router-dom'
import FeedPage from './pages/FeedPage.jsx'
import HomePage from './pages/HomePage.jsx'
import UploadPage from './pages/UploadPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import BattlePage from './pages/BattlePage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import CategoriesPage from './pages/CategoriesPage.jsx'
import CategoryDetailPage from './pages/CategoryDetailPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

/* ── SVG icon components ── */
const Icon = {
  Grid: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Tag: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a1.969 1.969 0 011.414.586l6.828 6.828a2 2 0 010 2.828l-5.657 5.657a2 2 0 01-2.828 0L4.929 12.07A2 2 0 014.343 10.656V5.343A2 2 0 016.343 3H7z" /></svg>,
  Trophy: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-4.5-9.5L12 4l4.5 7.5M6 8H4a1 1 0 01-1-1V5a1 1 0 011-1h2m12 4h2a1 1 0 001-1V5a1 1 0 00-1-1h-2" /></svg>,
  Swords: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Chart: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  User: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Upload: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  Logout: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
}

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <Icon.Grid /> },
  { to: '/categories', label: 'Categories', icon: <Icon.Tag /> },
  { to: '/leaderboard', label: 'Leaderboard', icon: <Icon.Trophy /> },
  { to: '/battle', label: 'Battle', icon: <Icon.Swords /> },
  { to: '/analytics', label: 'Analytics', icon: <Icon.Chart /> },
  { to: '/profile', label: 'Profile', icon: <Icon.User /> }
]

function Layout ({ children }) {
  const isAuthed = Boolean(localStorage.getItem('token'))

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen text-slate-900">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">scoreme</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-pink-50 text-pink-700'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/upload" className="btn-primary text-sm py-2">
              <Icon.Upload />
              <span className="hidden sm:inline">Upload</span>
            </Link>
            {!isAuthed && <Link to="/login" className="btn-ghost text-sm">Login</Link>}
            {!isAuthed && <Link to="/register" className="btn-ghost text-sm">Sign up</Link>}
            {isAuthed && (
              <button onClick={logout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition">
                <Icon.Logout />
              </button>
            )}
          </div>
        </div>

        {/* mobile nav */}
        <div className="md:hidden border-t border-slate-100 px-4 pb-2 pt-1.5 flex gap-1 overflow-x-auto">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                  isActive ? 'bg-pink-50 text-pink-700' : 'text-slate-500'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 animate-in">
        {children}
      </main>

      <footer className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-10 pt-4 flex items-center gap-3 text-xs text-slate-400">
        <div className="w-5 h-5 rounded bg-pink-100 flex items-center justify-center">
          <svg className="w-3 h-3 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
        <span>scoreme — structured campus feedback</span>
      </footer>
    </div>
  )
}

export default function App () {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/dashboard" element={<Layout><FeedPage /></Layout>} />
      <Route path="/categories" element={<Layout><CategoriesPage /></Layout>} />
      <Route path="/categories/:name" element={<Layout><CategoryDetailPage /></Layout>} />
      <Route path="/upload" element={<Layout><UploadPage /></Layout>} />
      <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
      <Route path="/leaderboard" element={<Layout><LeaderboardPage /></Layout>} />
      <Route path="/battle" element={<Layout><BattlePage /></Layout>} />
      <Route path="/analytics" element={<Layout><AnalyticsPage /></Layout>} />
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
    </Routes>
  )
}
