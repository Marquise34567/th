// Client-safe proxy for job operations.
// This file intentionally avoids any server-only SDKs (firebase-admin).
// It forwards job operations to an external backend defined by NEXT_PUBLIC_API_URL.

type JobRecord = {
  id: string
  uid?: string
  phase?: string
  overallProgress?: number
  overallEtaSec?: number | null
  message?: string
  createdAt?: number
  updatedAt?: number
  objectPathOriginal?: string | null
  objectPathNormalized?: string | null
  finalVideoPath?: string | null
  objectPathOutput?: string
  error?: string | null
  logs?: string[]
  [k: string]: any
}

const API = process.env.NEXT_PUBLIC_API_URL || ''

async function handleJSON(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Job API error: ${res.status} ${text}`)
  }
  return res.json()
}

export async function createJob(job: JobRecord) {
  const res = await fetch(`${API}/api/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job),
    credentials: 'include',
  })
  return handleJSON(res)
}

export async function getJob(id: string): Promise<JobRecord | null> {
  const res = await fetch(`${API}/api/jobs/${encodeURIComponent(id)}`, { credentials: 'include' })
  if (res.status === 404) return null
  return handleJSON(res)
}

export async function updateJob(id: string, patch: Partial<JobRecord>) {
  const res = await fetch(`${API}/api/jobs/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
    credentials: 'include',
  })
  return handleJSON(res)
}

export async function appendJobLog(id: string, message: string) {
  const res = await fetch(`${API}/api/jobs/${encodeURIComponent(id)}/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    credentials: 'include',
  })
  return handleJSON(res)
}

export default {
  createJob,
  getJob,
  updateJob,
  appendJobLog,
}

// Backwards-compat: alias
export async function setJob(id: string, patch: Partial<JobRecord>) {
  return updateJob(id, patch)
}
