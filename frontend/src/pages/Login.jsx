import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { btnPrimary, field, labelCls } from '../ui'

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api('/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      })
      onLogin(data.token, data.user)
      navigate('/', { replace: true })
    } catch (requestError) {
      setError(requestError.errors?.email?.[0] || requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-cream px-4 py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-pine-100/70 blur-[130px]"></div>
        <div className="absolute -bottom-48 right-0 h-[30rem] w-[30rem] rounded-full bg-emerald-100/60 blur-[120px]"></div>
      </div>
      <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[24vw] font-bold tracking-tighter text-pine-900/[0.04]" aria-hidden="true">
        MIGCANAWAY
      </p>

      <div className="relative z-10 w-full max-w-md animate-fade-up rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_30px_100px_-40px_rgba(12,40,34,0.35)] sm:p-9">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <img src="/assets/barangay-logo.jpg" alt="Barangay Migcanaway seal" className="h-16 w-16 rounded-full object-cover ring-1 ring-slate-200 sm:h-20 sm:w-20" />
            <img src="/assets/tangub-logo.jpg" alt="Tangub City seal" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
          </div>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-pine-600">Barangay</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[0.08em] text-pine-800">MIGCANAWAY</h1>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">Tangub City</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Resident Survey &amp; Assistance</p>
          <div className="mx-auto mt-6 h-px w-2/3 bg-gradient-to-r from-transparent via-pine-200 to-transparent"></div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <label className={labelCls} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={field}
              placeholder="admin@barangay.test"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={field}
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <button type="submit" className={`${btnPrimary} mt-2 w-full px-4 py-3`} disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <p className="text-center text-[10px] uppercase tracking-[0.16em] text-slate-400">
            Demo · admin@barangay.test / password
          </p>
        </form>
      </div>
    </div>
  )
}
