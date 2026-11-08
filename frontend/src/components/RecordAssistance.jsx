import { useState } from 'react'
import { api } from '../api'
import { btnGhost, btnPrimary, field, labelCls } from '../ui'
import Modal from './Modal'

const programs = ['Food Pack', 'Medical', 'Cash Aid', 'Livelihood', 'Other']

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function RecordAssistance({ resident, onClose, onSaved, notify }) {
  const [form, setForm] = useState({
    program: 'Food Pack',
    item: '',
    amount: '',
    given_at: today(),
    remarks: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')

    try {
      await api(`/residents/${resident.id}/assistance-records`, {
        method: 'POST',
        body: {
          program: form.program,
          item: form.item.trim() || null,
          amount: form.amount === '' ? null : Number(form.amount),
          given_at: form.given_at,
          remarks: form.remarks.trim() || null,
        },
      })

      notify('Assistance recorded')
      onSaved?.()
      onClose()
    } catch (requestError) {
      setError(requestError.errors?.program?.[0] || requestError.errors?.given_at?.[0] || requestError.errors?.amount?.[0] || requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title="Record assistance"
      subtitle={resident.name}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" className={btnGhost} onClick={onClose}>Cancel</button>
          <button type="submit" form="record-assistance-form" className={btnPrimary} disabled={saving}>
            {saving ? 'Saving...' : 'Save assistance'}
          </button>
        </div>
      }
    >
      <form id="record-assistance-form" className="space-y-4" onSubmit={submit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="assistance-program">Program</label>
            <select id="assistance-program" className={field} value={form.program} onChange={(event) => update('program', event.target.value)}>
              {programs.map((program) => <option key={program} value={program}>{program}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="assistance-date">Date given</label>
            <input
              id="assistance-date"
              type="date"
              className={field}
              max={today()}
              value={form.given_at}
              onChange={(event) => update('given_at', event.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="assistance-item">Item / description</label>
          <input
            id="assistance-item"
            className={field}
            placeholder="e.g. 5kg rice and canned goods"
            value={form.item}
            onChange={(event) => update('item', event.target.value)}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="assistance-amount">Amount (optional)</label>
          <input
            id="assistance-amount"
            type="number"
            min="0"
            step="0.01"
            className={field}
            placeholder="0.00"
            value={form.amount}
            onChange={(event) => update('amount', event.target.value)}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="assistance-remarks">Remarks</label>
          <textarea
            id="assistance-remarks"
            className={`${field} min-h-[5rem] resize-y`}
            placeholder="Optional notes..."
            value={form.remarks}
            onChange={(event) => update('remarks', event.target.value)}
          />
        </div>

        {error && <p role="alert" className="text-xs font-medium text-red-600">{error}</p>}

        <p className="rounded-lg bg-pine-50 px-3 py-2 text-xs text-pine-800">
          Saving this record will mark the resident as <strong>Given</strong>.
        </p>
      </form>
    </Modal>
  )
}
