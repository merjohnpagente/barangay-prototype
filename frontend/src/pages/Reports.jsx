import { useEffect, useState } from 'react'
import { api, downloadCsv } from '../api'
import { Page } from '../components/Layout'
import { btnGhost, btnPrimary } from '../ui'

function StatCard({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
    </div>
  )
}

export default function Reports({ notify }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    let alive = true

    api('/reports')
      .then((result) => alive && setData(result))
      .catch((requestError) => alive && setError(requestError.message))

    return () => {
      alive = false
    }
  }, [])

  const exportCsv = async () => {
    setExporting(true)

    try {
      await downloadCsv('/residents/export', `barangay-residents-${new Date().toISOString().slice(0, 10)}.csv`)
      notify('Export downloaded')
    } catch (requestError) {
      notify(requestError.message)
    } finally {
      setExporting(false)
    }
  }

  const actions = (
    <>
      <button type="button" className={btnGhost} onClick={() => window.print()}>Print</button>
      <button type="button" className={btnPrimary} onClick={exportCsv} disabled={exporting}>
        {exporting ? 'Exporting...' : 'Export'}
      </button>
    </>
  )

  if (error) {
    return (
      <Page title="Reports and Summary" subtitle="A snapshot of residents and assistance across the barangay.">
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      </Page>
    )
  }

  if (!data) {
    return (
      <Page title="Reports and Summary" subtitle="A snapshot of residents and assistance across the barangay.">
        <p className="text-sm text-slate-500">Loading reports...</p>
      </Page>
    )
  }

  const stats = [
    [data.summary.total, 'Total residents'],
    [data.summary.pwd, 'PWD residents'],
    [data.summary.assisted, 'Assisted'],
    [data.summary.pending, 'Pending'],
  ]

  return (
    <Page title="Reports and Summary" subtitle="A snapshot of residents and assistance across the barangay." actions={actions}>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([value, label]) => <StatCard key={label} value={value} label={label} />)}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-5">
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-3">
          <h2 className="text-sm font-medium text-slate-900">Assistance per Purok</h2>
          <p className="mt-0.5 text-xs text-slate-500">Residents assisted in each area.</p>
          <div className="mt-8 flex h-40 items-end gap-3 sm:gap-4">
            {data.puroks.map((purok, index) => (
              <div key={purok.purok} className="relative flex h-full flex-1 items-end">
                <span className="absolute inset-x-0 -top-5 text-center text-[11px] font-medium text-slate-400">{purok.percent}%</span>
                <div
                  className="w-full origin-bottom animate-grow-y rounded-t bg-pine-700"
                  style={{ height: `${purok.percent}%`, animationDelay: `${index * 60}ms` }}
                  title={`${purok.purok}: ${purok.percent}%`}
                ></div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-3 border-t border-slate-100 pt-3 sm:gap-4">
            {data.puroks.map((purok) => (
              <span key={purok.purok} className="flex-1 text-center text-[11px] text-slate-400">{purok.purok}</span>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-sm font-medium text-slate-900">Projects and Activities</h2>
          <p className="mt-0.5 text-xs text-slate-500">Ongoing barangay programs.</p>
          <div className="mt-6 space-y-4">
            {data.projects.map((project, index) => (
              <div key={project.name}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">{project.name}</span>
                  <span className="text-xs text-slate-400">{project.percent}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full origin-left animate-grow-x rounded-full bg-pine-700"
                    style={{ width: `${project.percent}%`, animationDelay: `${index * 60}ms` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Page>
  )
}
