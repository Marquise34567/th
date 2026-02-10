import express from 'express'
import { renderVerticalClip, renderDraftClip, renderThumbnail } from '../lib/render/renderVertical'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const options = req.body || {}
    if (!options.inputPath || !options.outputPath) return res.status(400).json({ ok: false, error: 'inputPath and outputPath required' })
    await renderDraftClip(options)
    return res.json({ ok: true })
  } catch (e: any) {
    console.error('render error', e)
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

router.post('/thumbnail', async (req, res) => {
  try {
    const { inputPath, outputPath, timestamp } = req.body || {}
    if (!inputPath || !outputPath || typeof timestamp !== 'number') return res.status(400).json({ ok: false, error: 'inputPath, outputPath, timestamp required' })
    await renderThumbnail(inputPath, outputPath, timestamp)
    return res.json({ ok: true })
  } catch (e: any) {
    console.error('thumbnail error', e)
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

export default router
