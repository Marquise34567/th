import express from 'express'
import Stripe from 'stripe'
import bodyParser from 'body-parser'
import { getAuth } from '../lib/firebaseAdmin'

const router = express.Router()
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

router.post('/activate', async (req, res) => {
  try {
    // activation flow depends on your app; stub returns not implemented
    return res.status(501).json({ ok: false, error: 'billing activate not implemented' })
  } catch (e: any) {
    console.error('billing activate', e)
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

// Stripe webhook needs the raw body - this route will be mounted with raw parser in server
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: any, res) => {
  try {
    const sig = req.headers['stripe-signature']
    const payload = req.body
    // Verify signature if STRIPE_WEBHOOK_SECRET is set
    if (process.env.STRIPE_WEBHOOK_SECRET && stripe) {
      try {
        stripe.webhooks.constructEvent(payload, sig as string, process.env.STRIPE_WEBHOOK_SECRET)
      } catch (e: any) {
        console.error('webhook signature verification failed', e)
        return res.status(400).send(`Webhook Error: ${e.message}`)
      }
    }
    // TODO: handle events
    console.log('stripe webhook received')
    return res.json({ ok: true })
  } catch (e: any) {
    console.error('stripe webhook error', e)
    return res.status(500).json({ ok: false, error: e?.message || String(e) })
  }
})

export default router
