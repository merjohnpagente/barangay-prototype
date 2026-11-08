const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const getToken = () => localStorage.getItem('barangay_token') || ''

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('barangay_user')) || { name: 'System Admin', email: '' }
  } catch {
    return { name: 'System Admin', email: '' }
  }
}

export const setSession = (token, user) => {
  localStorage.setItem('barangay_token', token)
  localStorage.setItem('barangay_user', JSON.stringify(user))
}

export const clearSession = () => {
  localStorage.removeItem('barangay_token')
  localStorage.removeItem('barangay_user')
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' }

  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401 && auth) {
    clearSession()
    window.dispatchEvent(new Event('auth:expired'))
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong.')
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}

async function download(path, filename, accept) {
  const response = await fetch(`${BASE}/api${path}`, {
    headers: {
      Accept: accept,
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (response.status === 401) {
    clearSession()
    window.dispatchEvent(new Event('auth:expired'))
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Download failed.')
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export async function downloadCsv(path, filename) {
  await download(path, filename, 'text/csv')
}

export async function downloadFile(path, filename) {
  await download(path, filename, 'application/octet-stream')
}

export async function uploadFile(path, file, field = 'file') {
  const body = new FormData()
  body.append(field, file)

  const response = await fetch(`${BASE}/api${path}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body,
  })

  if (response.status === 401) {
    clearSession()
    window.dispatchEvent(new Event('auth:expired'))
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'Upload failed.')
    error.status = response.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}
