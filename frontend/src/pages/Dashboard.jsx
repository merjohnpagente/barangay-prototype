import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import AidStatus from '../components/AidStatus'
import { Page } from '../components/Layout'
import { CheckIcon, ClockIcon, HeartIcon, UsersIcon } from '../icons'
import { btnGhost, btnPrimary } from '../ui'

const statMeta = [
  ['total', 'Total residents', 'Registered residents', UsersIcon, 'text-pine-700'],
  ['pwd', 'PWD residents', 'Persons with disability', HeartIcon, 'text-pine-600'],
  ['assisted', 'Assisted', 'Received assistance', CheckIcon, 'text-emerald-600'],
  ['pending', 'Pending', 'Awaiting support', ClockIcon, 'text-amber-500'],
]

function DashStat({ value, label, caption, icon: Icon, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
        <span className={tone} aria-hidden="true"><Icon /></span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{caption}</p>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true

    api('/dashboard')
      .then((result) => {
        if (!alive) return
        setData(result)
        setError('')
      })
      .catch((requestError) => alive && setError(requestError.message))

    return () => {
      alive = false
    }
  }, [attempt])

  if (error) {
    return (
      <Page title="Dashboard" subtitle="A quick look at residents and assistance across the barangay.">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
          <button type="button" className="ml-3 font-semibold underline" onClick={() => setAttempt((value) => value + 1)}>
            Retry
          </button>
        </div>
      </Page>
    )
  }

  if (!data) {
    return (
      <Page title="Dashboard" subtitle="A quick look at residents and assistance across the barangay.">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </Page>
    )
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <Page
      title="Dashboard"
      subtitle="A quick look at residents and assistance across the barangay."
      actions={
        <>
          <Link to="/residents/new" className={btnPrimary}>New resident</Link>
          <Link to="/assistance" className={btnGhost}>Review assistance</Link>
        </>
      }
    >
      <section className="relative mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(23,69,59,0.09),transparent_48%)]" aria-hidden="true"></div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-pine-600">Barangay overview · Tangub City</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {greeting}, <span className="text-pine-700">Admin</span>.
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{today} — here's what's happening with residents and assistance today.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/residents/new" className={btnPrimary}>New resident</Link>
            <Link to="/assistance" className={btnGhost}>Review assistance</Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statMeta.map(([key, label, caption, icon, tone]) => (
          <DashStat key={key} value={data.summary[key]} label={label} caption={caption} icon={icon} tone={tone} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-3">
          <div className="flex items-start justify-between gap-3 px-5 py-4">
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Recent residents</h2>
              <p className="mt-1 text-xs text-slate-500">Latest profiles added to the record.</p>
            </div>
            <Link to="/residents" className="rounded-lg px-2 py-1.5 text-xs font-medium text-pine-700 transition-colors hover:bg-pine-50">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto border-t border-slate-100">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-2.5 font-medium">ID</th>
                  <th className="px-3 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Work</th>
                  <th className="px-5 py-2.5 font-medium">Assistance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.recent.map((resident) => (
                  <tr key={resident.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-slate-500">{resident.code}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-slate-900">{resident.name}</td>
                    <td className="px-4 py-3 text-slate-500">{resident.job}</td>
                    <td className="px-5 py-3"><AidStatus value={resident.assistance} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">Pending assistance</h2>
            <p className="mt-1 text-xs text-slate-500">Residents waiting for support.</p>
          </div>
          <div className="mt-4 flex-1 space-y-3">
            {data.pending.map((resident) => (
              <div key={resident.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{resident.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{resident.need || 'Assistance'}</p>
                </div>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true"></span>
              </div>
            ))}
            {!data.pending.length && <p className="text-sm text-slate-500">No pending assistance.</p>}
          </div>
          <Link to="/assistance" className={`${btnGhost} mt-5 w-full`}>View assistance</Link>
        </section>
      </div>
    </Page>
  )
}
