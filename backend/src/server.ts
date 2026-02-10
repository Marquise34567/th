import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Basic endpoints expected by the frontend. Implementations should be
// replaced with the real handlers in `backend/src/api/*` when available.
app.post('/api/auth/verify', (req, res) => {
  // expect Authorization header Bearer <token>
  // Real implementation should verify via firebase-admin and return { uid }
  res.status(501).json({ error: 'Not implemented: auth verify' })
})

app.post('/api/jobs', (_req, res) => res.status(501).json({ error: 'Not implemented: create job' }))
app.get('/api/jobs/:id', (_req, res) => res.status(501).json({ error: 'Not implemented: get job' }))
app.patch('/api/jobs/:id', (_req, res) => res.status(501).json({ error: 'Not implemented: update job' }))
app.post('/api/jobs/:id/logs', (_req, res) => res.status(501).json({ error: 'Not implemented: append log' }))

// Serve any static outputs (if present)
const outputsDir = path.join(process.cwd(), 'outputs')
app.use('/outputs', express.static(outputsDir))

const port = Number(process.env.PORT || 3001)
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`))
