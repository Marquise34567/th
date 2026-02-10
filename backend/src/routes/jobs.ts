import express from 'express'
import { getFirestore } from '../lib/firebaseAdmin'

const router = express.Router()
const COLLECTION = 'jobs'

router.post('/', async (req, res) => {
  try {
    const payload = req.body || {}
    const id = payload.id || `job_${Date.now()}_${Math.floor(Math.random()*10000)}`
    const db = getFirestore()
    const base = { id, ...payload, createdAt: Date.now(), updatedAt: Date.now() }
    await db.collection(COLLECTION).doc(String(id)).set(base)
    return res.json({ ok: true, data: base })
  } catch (e: any) {
    console.error('create job error', e)
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const db = getFirestore()
    const snap = await db.collection(COLLECTION).doc(String(id)).get()
    if (!snap.exists) return res.status(404).json({ ok: false, error: 'not found' })
    return res.json({ ok: true, data: snap.data() })
  } catch (e: any) {
    console.error('get job error', e)
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const patch = req.body || {}
    const db = getFirestore()
    await db.collection(COLLECTION).doc(String(id)).set({ ...patch, updatedAt: Date.now() }, { merge: true })
    const snap = await db.collection(COLLECTION).doc(String(id)).get()
    return res.json({ ok: true, data: snap.data() })
  } catch (e: any) {
    console.error('update job error', e)
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

router.post('/:id/logs', async (req, res) => {
  try {
    const id = req.params.id
    const { message } = req.body || {}
    if (!message) return res.status(400).json({ ok: false, error: 'message required' })
    const db = getFirestore()
    const docRef = db.collection(COLLECTION).doc(String(id))
    const snap = await docRef.get()
    const current = snap.exists ? (snap.data() || {}) : {}
    const logs = Array.isArray(current.logs) ? [...current.logs, message] : [message]
    await docRef.set({ logs, updatedAt: Date.now() }, { merge: true })
    const next = await docRef.get()
    return res.json({ ok: true, data: next.data() })
  } catch (e: any) {
    console.error('append log error', e)
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

export default router
