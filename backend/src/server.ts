import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import morgan from 'morgan'
import analyzeRouter from './routes/analyze'
import jobsRouter from './routes/jobs'
import videoRouter from './routes/video'
import billingRouter from './routes/billing'
import { initFirebaseAdmin } from './lib/firebaseAdmin'

dotenv.config()

initFirebaseAdmin()

const app = express()

const allowedOrigins = [process.env.FRONTEND_ORIGIN, process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'].filter(Boolean) as string[]
app.use(cors({ origin: (origin, cb) => {
  if (!origin) return cb(null, true)
  if (allowedOrigins.length === 0) return cb(null, true)
  if (allowedOrigins.includes(origin)) return cb(null, true)
  return cb(new Error('Not allowed by CORS'))
}}))

app.use(morgan('dev'))
app.use(express.json())

// Mount routers
app.use('/api/analyze', analyzeRouter)
app.use('/api/video', videoRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/billing', billingRouter)

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Serve any static outputs (if present)
const outputsDir = path.join(process.cwd(), 'outputs')
app.use('/outputs', express.static(outputsDir))

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error', err)
  res.status(500).json({ ok: false, error: err?.message || 'internal error' })
})

const port = Number(process.env.PORT || 3001)
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`))
