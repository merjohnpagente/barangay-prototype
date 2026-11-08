import { useEffect, useRef, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { clearSession, getToken, getUser, setSession } from './api'
import Layout from './components/Layout'
import Backup from './pages/Backup'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Reports from './pages/Reports'
import Residents from './pages/Residents'
import Survey from './pages/Survey'

function Protected({ token, children }) {
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [token, setToken] = useState(() => getToken())
  const [user, setUser] = useState(() => getUser())
  const [toast, setToast] = useState('')
  const timer = useRef(null)

  const notify = (message) => {
    setToast(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 1800)
  }

  useEffect(() => {
    const expire = () => {
      setToken('')
      setUser(null)
    }

    window.addEventListener('auth:expired', expire)
    return () => window.removeEventListener('auth:expired', expire)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const login = (newToken, newUser) => {
    setSession(newToken, newUser)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    clearSession()
    setToken('')
    setUser(null)
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login onLogin={login} />}
        />
        <Route
          element={
            <Protected token={token}>
              <Layout user={user} onLogout={logout} />
            </Protected>
          }
        >
          <Route index element={<Dashboard notify={notify} />} />
          <Route path="residents" element={<Residents key="records" mode="records" notify={notify} />} />
          <Route path="residents/new" element={<Survey notify={notify} />} />
          <Route path="residents/:id/edit" element={<Survey notify={notify} />} />
          <Route path="assistance" element={<Residents key="assistance" mode="assistance" notify={notify} />} />
          <Route path="reports" element={<Reports notify={notify} />} />
          <Route path="backup" element={<Backup notify={notify} />} />
        </Route>
        <Route path="*" element={<Navigate to={token ? '/' : '/login'} replace />} />
      </Routes>

      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
          <div role="status" aria-live="polite" className="animate-fade-up rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
            {toast}
          </div>
        </div>
      )}
    </>
  )
}
