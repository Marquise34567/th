import express from 'express'
import { analyzeVideo } from '../lib/videoAnalysis'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { inputPath } = req.body
    if (!inputPath) return res.status(400).json({ ok: false, error: 'inputPath required' })
    const out = await analyzeVideo(inputPath)
    return res.json({ ok: true, data: out })
  } catch (e: any) {
    console.error('analyze error', e)
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

export default router
