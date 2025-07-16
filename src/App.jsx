import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import './App.css'
import LoginRegister from './LoginRegister'
import NotesDashboard from './NotesDashboard'
import Profile from './Profile'

// Auth context for JWT
const AuthContext = createContext()
export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const navigate = useNavigate()

  const login = (jwt) => {
    setToken(jwt)
    localStorage.setItem('token', jwt)
    navigate('/notes')
  }
  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    navigate('/login')
  }
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function Layout({ children }) {
  const { token, logout } = useAuth()
  return (
    <div className="site-wrapper">
      <Navbar token={token} logout={logout} />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  )
}

function Navbar({ token, logout }) {
  return (
    <nav className="navbar-main">
      <div className="navbar-content">
        <Link to="/notes" className="navbar-logo">NotesApp</Link>
        {token && (
          <div className="navbar-links">
            <Link to="/notes">Notes</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} className="navbar-logout">Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="footer-main">
      <div>© {new Date().getFullYear()} NotesApp. All rights reserved.</div>
    </footer>
  )
}

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/notes" element={<ProtectedRoute><NotesDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<NavigateToDefault />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" />
  return children
}

function NavigateToDefault() {
  const { token } = useAuth()
  return <Navigate to={token ? "/notes" : "/login"} />
}

export default App
