import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'
import { Page } from '../components/Layout'
import { btnGhost, btnPrimary, field, labelCls } from '../ui'

const puroks = ['Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5']
const needs = ['Food Pack', 'Medical', 'Cash Aid', 'Livelihood']

const emptyForm = {
  name: '',
  age: '',
  sex: '',
  birthday: '',
  job: '',
  purok: '',
  pwd: 'No',
  need: '',
  remarks: '',
}

function computeAge(value) {
  if (!value) return ''

  const birthday = new Date(`${value}T00:00:00`)
  if (Number.isNaN(birthday.getTime())) return ''

  const today = new Date()
  let age = today.getFullYear() - birthday.getFullYear()

  if (today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())) {
    age -= 1
  }

  return age >= 0 ? age : ''
}

export default function Survey({ notify }) {
  const { id } = useParams()
  const editing = Boolean(id)
  const navigate = useNavigate()
  const nameRef = useRef(null)
  const [form, setForm] = useState(emptyForm)
  const [original, setOriginal] = useState(emptyForm)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(editing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editing) return undefined

    let alive = true
    setLoading(true)

    api(`/residents/${id}`)
      .then(({ data }) => {
        if (!alive) return

        const next = {
          name: data.name || '',
          age: data.age ?? '',
          sex: data.sex || '',
          birthday: data.birthday || '',
          job: data.job || '',
          purok: data.purok || '',
          pwd: data.pwd || 'No',
          need: data.need || '',
          remarks: data.remarks || '',
        }

        setForm(next)
        setOriginal(next)
        setCode(data.code)
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
  }, [editing, id])

  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))

  const changeBirthday = (value) => {
    setForm((previous) => {
      const age = computeAge(value)
      return { ...previous, birthday: value, age: age === '' ? previous.age : age }
    })
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Full name is required.')
      nameRef.current?.focus()
      return
    }

    setSaving(true)

    const body = {
      name: form.name.trim(),
      age: form.age === '' ? null : Number(form.age),
      birthday: form.birthday || null,
      sex: form.sex || null,
      job: form.job.trim() || null,
      purok: form.purok || null,
      pwd: form.pwd,
      need: form.need || null,
      remarks: form.remarks.trim() || null,
    }

    try {
      if (editing) {
        await api(`/residents/${id}`, { method: 'PUT', body })
      } else {
        await api('/residents', { method: 'POST', body })
      }

      notify(editing ? 'Resident updated' : 'Resident saved')
      navigate('/residents')
    } catch (requestError) {
      setError(requestError.errors?.name?.[0] || requestError.errors?.birthday?.[0] || requestError.message)
      nameRef.current?.focus()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Page title="Edit Resident" subtitle="Update the resident profile and assistance details.">
        <p className="text-sm text-slate-500">Loading resident...</p>
      </Page>
    )
  }

  return (
    <Page
      title={editing ? 'Edit Resident' : 'Resident Survey Form'}
      subtitle={editing ? 'Update the resident profile and assistance details.' : 'Add a resident and record the assistance they need.'}
    >
      <form className="overflow-hidden rounded-xl border border-slate-200 bg-white" onSubmit={submit}>
        <div className="space-y-8 p-5 sm:p-7">
          <section>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Personal information</h2>
                <p className="mt-0.5 text-xs text-slate-500">Basic details for the resident record.</p>
              </div>
              {editing && code && (
                <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-600">{code}</span>
              )}
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label className={labelCls} htmlFor="fullname">Full name</label>
                <input
                  ref={nameRef}
                  id="fullname"
                  className={field}
                  placeholder="Last, First, Middle"
                  value={form.name}
                  onChange={(event) => {
                    update('name', event.target.value)
                    if (error) setError('')
                  }}
                  required
                />
                {error && <p role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p>}
              </div>
              <div className="sm:col-span-1">
                <label className={labelCls} htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  max="120"
                  className={field}
                  placeholder="00"
                  value={form.age}
                  onChange={(event) => update('age', event.target.value)}
                />
              </div>
              <div className="sm:col-span-1">
                <label className={labelCls} htmlFor="sex">Sex</label>
                <select id="sex" className={field} value={form.sex} onChange={(event) => update('sex', event.target.value)}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="birthday">Birthday</label>
                <input
                  id="birthday"
                  type="date"
                  className={field}
                  aria-describedby="birthday-hint"
                  value={form.birthday}
                  onChange={(event) => changeBirthday(event.target.value)}
                />
                <p id="birthday-hint" className="mt-1 text-[11px] text-slate-400">Age updates automatically each year.</p>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="work">Work / occupation</label>
                <input
                  id="work"
                  className={field}
                  placeholder="e.g. Farmer"
                  value={form.job}
                  onChange={(event) => update('job', event.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="purok">Purok / address</label>
                <select id="purok" className={field} value={form.purok} onChange={(event) => update('purok', event.target.value)}>
                  <option value="">Select</option>
                  {puroks.map((purok) => <option key={purok} value={purok}>{purok}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-100 pt-8">
            <h2 className="text-sm font-semibold text-slate-900">Assistance details</h2>
            <p className="mt-0.5 text-xs text-slate-500">Needs and notes for this resident.</p>
            <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <span className={labelCls}>PWD status</span>
                <div className="flex gap-6 pt-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input type="radio" name="pwd" value="Yes" className="h-4 w-4 accent-pine-700" checked={form.pwd === 'Yes'} onChange={() => update('pwd', 'Yes')} />
                    Yes
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                    <input type="radio" name="pwd" value="No" className="h-4 w-4 accent-pine-700" checked={form.pwd === 'No'} onChange={() => update('pwd', 'No')} />
                    No
                  </label>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label className={labelCls} htmlFor="need">Assistance needed</label>
                <select id="need" className={field} value={form.need} onChange={(event) => update('need', event.target.value)}>
                  <option value="">Select</option>
                  {needs.map((need) => <option key={need} value={need}>{need}</option>)}
                </select>
              </div>
              <div className="sm:col-span-6">
                <label className={labelCls} htmlFor="remarks">Remarks</label>
                <textarea
                  id="remarks"
                  className={`${field} min-h-[6rem] resize-y`}
                  placeholder="Type notes here..."
                  value={form.remarks}
                  onChange={(event) => update('remarks', event.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:px-7">
          <button type="button" className={btnGhost} onClick={() => { setForm(original); setError('') }}>Clear</button>
          <button type="submit" className={btnPrimary} disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Save changes' : 'Save resident'}
          </button>
        </div>
      </form>
    </Page>
  )
}
