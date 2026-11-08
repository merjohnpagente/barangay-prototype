import { useEffect, useRef, useState } from 'react'
import { api, downloadFile, uploadFile } from '../api'
import { Page } from '../components/Layout'
import { btnGhost, btnPrimary } from '../ui'

function formatSize(bytes) {
  if (!bytes) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }

  return `${value.toFixed(unit ? 1 : 0)} ${units[unit]}`
}

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function Backup({ notify }) {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [busy, setBusy] = useState('')
  const [uploading, setUploading] = useState(false)
  const [version, setVersion] = useState(0)
  const fileRef = useRef(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')

    api('/backups')
      .then((data) => {
        if (!alive) return
        setBackups(data.backups || [])
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
  }, [version])

  const createBackup = async () => {
    setCreating(true)
    setError('')

    try {
      const data = await api('/backups', { method: 'POST' })
      setBackups(data.backups || [])
      notify('Backup created')
    } catch (requestError) {
      setError(requestError.message)
      notify(requestError.message)
    } finally {
      setCreating(false)
    }
  }

  const restoreExisting = async (name) => {
    if (!window.confirm(`Restore ${name}? A safety backup of the current database will be created first.`)) return

    setBusy(name)
    setError('')

    try {
      await api(`/backups/${encodeURIComponent(name)}/restore`, { method: 'POST' })
      notify('Database restored. Reloading...')
      window.setTimeout(() => window.location.reload(), 800)
    } catch (requestError) {
      setError(requestError.message)
      notify(requestError.message)
    } finally {
      setBusy('')
    }
  }

  const restoreFromFile = async () => {
    const file = fileRef.current?.files?.[0]
    if (!file) return

    if (!window.confirm('Restore from this file? A safety backup of the current database will be created first.')) {
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    setUploading(true)
    setError('')

    try {
      await uploadFile('/backups/restore', file, 'backup')
      notify('Database restored. Reloading...')
      window.setTimeout(() => window.location.reload(), 800)
    } catch (requestError) {
      setError(requestError.message)
      notify(requestError.message)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const download = async (name) => {
    try {
      await downloadFile(`/backups/${encodeURIComponent(name)}/download`, name)
      notify('Backup downloaded')
    } catch (requestError) {
      notify(requestError.message)
    }
  }

  return (
    <Page
      title="Backup & Restore"
      subtitle="Keep a safe copy of the resident database for the barangay office."
    >
      <div className="rounded-xl border border-pine-100 bg-pine-50/60 p-4 text-sm text-pine-900">
        <p className="font-medium">Keep an extra copy on a USB drive.</p>
        <p className="mt-1 text-xs leading-5 text-pine-800/80">
          Backups are saved inside <span className="font-mono">storage/app/backups</span>. Automatic backup runs daily at 5:00 PM when the Laravel scheduler is running.
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">Create a backup now</p>
          <p className="mt-0.5 text-xs text-slate-500">A copy of the current SQLite database will be saved.</p>
        </div>
        <button type="button" className={btnPrimary} onClick={createBackup} disabled={creating}>
          {creating ? 'Creating...' : 'Create backup'}
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-900">Restore from a file</p>
          <p className="mt-0.5 text-xs text-slate-500">Use this for a backup saved on a USB or another computer. The current database is backed up first.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".sqlite,.db,application/octet-stream,application/x-sqlite3"
            className="hidden"
            onChange={restoreFromFile}
          />
          <button type="button" className={btnGhost} onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? 'Restoring...' : 'Choose file'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button type="button" className="ml-3 font-semibold underline" onClick={() => setVersion((value) => value + 1)}>
            Retry
          </button>
        </div>
      )}

      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-medium text-slate-900">Available backups</h2>
            <p className="mt-0.5 text-xs text-slate-500">Download a copy or restore an earlier version.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{backups.length}</span>
        </div>

        {loading && <p className="px-4 py-8 text-center text-sm text-slate-500">Loading backups...</p>}

        {!loading && !backups.length && (
          <p className="px-4 py-8 text-center text-sm text-slate-500">No backups yet. Create your first backup above.</p>
        )}

        {!loading && backups.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {backups.map((backup) => (
              <li key={backup.name} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs font-medium text-slate-800">{backup.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDate(backup.modified)} · {formatSize(backup.size)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => download(backup.name)}
                    className="text-sm font-medium text-pine-700 transition hover:text-pine-800"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    onClick={() => restoreExisting(backup.name)}
                    disabled={busy === backup.name}
                    className="text-sm font-medium text-red-600 transition hover:text-red-700 disabled:opacity-40"
                  >
                    {busy === backup.name ? 'Restoring...' : 'Restore'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Page>
  )
}
