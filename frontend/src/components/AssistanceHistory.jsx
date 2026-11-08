import { useEffect, useState } from 'react'
import { api } from '../api'
import { btnGhost } from '../ui'
import Modal from './Modal'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatAmount(value) {
  if (value === null || value === undefined || value === '') return ''
  return `₱${Number(value).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function AssistanceHistory({ resident, onClose, notify, onChanged }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')

    api(`/residents/${resident.id}/assistance-records`)
      .then(({ data }) => {
        if (!alive) return
        setRecords(data)
        setLoading(false)
      })
      .catch((requestError) => {
        if (!alive) return
        setError(requestError.message)
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [resident.id, version])

  const remove = async (record) => {
    if (!window.confirm('Delete this assistance record? This will not delete the resident.')) return

    setDeleting(record.id)

    try {
      await api(`/residents/${resident.id}/assistance-records/${record.id}`, { method: 'DELETE' })
      notify('Assistance record deleted')
      setVersion((value) => value + 1)
      onChanged?.()
    } catch (requestError) {
      notify(requestError.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <Modal
      title="Assistance history"
      subtitle={resident.name}
      onClose={onClose}
      wide
      footer={
        <div className="flex justify-end">
          <button type="button" className={btnGhost} onClick={onClose}>Close</button>
        </div>
      }
    >
      {loading && <p className="py-6 text-center text-sm text-slate-500">Loading history...</p>}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button type="button" className="ml-3 font-semibold underline" onClick={() => setVersion((value) => value + 1)}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && !records.length && (
        <p className="py-6 text-center text-sm text-slate-500">No assistance recorded for this resident yet.</p>
      )}

      {!loading && !error && records.length > 0 && (
        <ol className="space-y-3">
          {records.map((record) => (
            <li key={record.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{record.program}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{formatDate(record.given_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(record)}
                  disabled={deleting === record.id}
                  className="text-xs font-medium text-red-600 transition hover:text-red-700 disabled:opacity-40"
                >
                  {deleting === record.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>

              {record.item && <p className="mt-2 text-sm text-slate-600">{record.item}</p>}
              {formatAmount(record.amount) && (
                <p className="mt-1 text-sm font-medium text-slate-900">{formatAmount(record.amount)}</p>
              )}
              {record.remarks && <p className="mt-2 text-xs text-slate-500">{record.remarks}</p>}
              <p className="mt-3 text-[11px] text-slate-400">Recorded by {record.encoded_by}</p>
            </li>
          ))}
        </ol>
      )}
    </Modal>
  )
}
