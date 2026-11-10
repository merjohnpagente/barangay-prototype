import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { CloseIcon, LogoutIcon, MenuIcon } from '../icons'

const navGroups = [
  {
    label: 'Overview',
    items: [{ to: '/', label: 'Dashboard', end: true }],
  },
  {
    label: 'Records',
    items: [
      { to: '/residents', label: 'Residents' },
      { to: '/residents/new', label: 'Survey' },
    ],
  },
  {
    label: 'Services',
    items: [{ to: '/assistance', label: 'Assistance' }],
  },
  {
    label: 'Insights',
    items: [{ to: '/reports', label: 'Reports' }],
  },
  {
    label: 'System',
    items: [{ to: '/backup', label: 'Backup' }],
  },
]

function pageLabel(pathname) {
  if (pathname.startsWith('/residents/new')) return 'Survey'
  if (pathname.startsWith('/residents')) return 'Residents'
  if (pathname.startsWith('/assistance')) return 'Assistance'
  if (pathname.startsWith('/reports')) return 'Reports'
  if (pathname.startsWith('/backup')) return 'Backup'
  return 'Dashboard'
}

function BrandBlock({ onClick }) {
  return (
    <NavLink to="/" onClick={onClick} className="flex min-w-0 items-center gap-2.5 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700">
      <span className="flex shrink-0 items-center gap-1.5">
        <img src="/assets/barangay-logo.jpg" alt="" className="h-9 w-9 rounded-full object-cover" />
        <img src="/assets/tangub-logo.jpg" alt="" className="h-9 w-9 object-contain" />
      </span>
      <span className="min-w-0">
        <span className="block text-[9px] font-semibold uppercase tracking-[0.24em] text-pine-600">Barangay</span>
        <span className="mt-1 block text-sm font-semibold tracking-[0.1em] text-slate-900">MIGCANAWAY</span>
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-slate-400">Tangub City</span>
        <span className="block text-[9px] uppercase tracking-[0.14em] text-slate-400">Survey &amp; Assistance</span>
      </span>
    </NavLink>
  )
}

function NavItems({ onNavigate }) {
  return navGroups.map((group) => (
    <div key={group.label}>
      <p className="px-3 pb-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">{group.label}</p>
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                isActive ? 'bg-pine-50 font-medium text-pine-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  ))
}

function UserCard({ user, onLogout }) {
  return (
    <div className="mx-3 mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-pine-700 text-sm font-bold text-white">SA</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-slate-900">{user?.name || 'System Admin'}</p>
        <span className="mt-1 inline-flex rounded-full bg-pine-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-pine-700">Admin</span>
      </div>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        title="Log out"
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-700"
      >
        <LogoutIcon className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Page({ title, subtitle, actions, children }) {
  return (
    <>
      {actions && <div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden print:hidden">{actions}</div>}
      <div className="mb-8 hidden flex-wrap items-start justify-between gap-4 lg:flex">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {actions && <div className="flex items-center gap-2 print:hidden">{actions}</div>}
      </div>
      <div className="animate-fade-up">{children}</div>
    </>
  )
}

export default function Layout({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const label = pageLabel(location.pathname)

  const logout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return

    try {
      await api('/logout', { method: 'POST' })
    } catch {
      // Token may already be invalid; clear locally anyway.
    }

    onLogout()
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream text-slate-900 print:bg-white">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur lg:hidden print:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          className="-ml-1 grid h-10 w-10 place-items-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-700"
        >
          <MenuIcon />
        </button>
        <p className="pointer-events-none absolute left-1/2 top-1/2 max-w-[40%] -translate-x-1/2 -translate-y-1/2 truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900">
          {label}
        </p>
      </header>

      <aside className="hidden border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:flex lg:w-64 lg:flex-col print:hidden">
        <div className="px-5 py-5">
          <BrandBlock />
        </div>
        <UserCard user={user} onLogout={logout} />
        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3" aria-label="Main navigation">
          <NavItems />
        </nav>
        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      <div className="relative z-10 lg:pl-64 print:pl-0">
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:max-w-none lg:px-8 lg:py-10 xl:max-w-[1400px] 2xl:max-w-[1700px] print:max-w-none print:p-0">
          <Outlet />
        </main>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} aria-hidden="true"></div>
          <aside className="relative flex h-full w-72 max-w-[85%] animate-slide-in flex-col border-r border-slate-200 bg-white shadow-2xl" aria-label="Navigation menu">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-5">
              <BrandBlock onClick={() => setMenuOpen(false)} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
                className="-mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <CloseIcon />
              </button>
            </div>
            <UserCard user={user} onLogout={logout} />
            <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3" aria-label="Mobile navigation">
              <NavItems onNavigate={() => setMenuOpen(false)} />
            </nav>
            <div className="border-t border-slate-200 p-3">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <LogoutIcon /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
