// BrewCoff backend – Express + Stripe Checkout (Test Mode)
//
// Flöde: React -> POST /api/checkout -> Stripe Checkout (betalsida)
//        -> tillbaka till sidan -> GET /api/checkout/:id (kontroll att det är betalt)
//
// Viktigt: klienten skickar bara id + antal. Priserna hämtas här på servern
// från Firestore, så ingen kan ändra priset i webbläsaren.

import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import {
    products as defaultProducts,
    FREE_SHIPPING_LIMIT,
    SHIPPING_COST,
    STUDIO_PRICE,
    STUDIO_CART_ID
} from '../src/data/products.js'

const PORT = process.env.PORT || 4242
const FIREBASE_PROJECT = 'brewcoff-80dcd'
// Render sätter RENDER_EXTERNAL_URL automatiskt (t.ex. https://brewcoff.onrender.com)
const CLIENT_URLS = [process.env.RENDER_EXTERNAL_URL, process.env.CLIENT_URL || 'http://localhost:5179,http://localhost:5173']
    .filter(Boolean).join(',').split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean)
// CORS jämför bara domänen (utan sökväg), t.ex. https://meyerfoo20.github.io
const CLIENT_ORIGINS = [...new Set(CLIENT_URLS.map(u => new URL(u).origin))]

if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Saknar STRIPE_SECRET_KEY – kopiera .env.example till .env och fyll i din test-nyckel.')
    process.exit(1)
}
if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    console.error('Använd en TEST-nyckel (sk_test_...). Live-nycklar tar riktiga pengar.')
    process.exit(1)
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const app = express()
app.use(cors({ origin: CLIENT_ORIGINS }))
app.use(express.json())

// ===== Produkter från Firestore (REST, produkterna är publikt läsbara) =====
function firestoreValue(v) {
    if ('integerValue' in v) return Number(v.integerValue)
    if ('doubleValue' in v) return Number(v.doubleValue)
    if ('stringValue' in v) return v.stringValue
    return null
}

async function loadProducts() {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents/products?pageSize=300`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Firestore svarade ' + res.status)
    const data = await res.json()
    if (!data.documents?.length) return defaultProducts // samma fallback som frontenden
    return data.documents.map(d => {
        const f = d.fields || {}
        return {
            id: Number(firestoreValue(f.id ?? { stringValue: d.name.split('/').pop() })),
            name: firestoreValue(f.name ?? { stringValue: '' }),
            price: Number(firestoreValue(f.price ?? { integerValue: 0 }))
        }
    })
}

// Bygg Stripe-rader av {id, qty}. Okända produkter avvisas.
async function buildLineItems(items) {
    const products = await loadProducts()
    const lines = []
    let subtotal = 0
    for (const { id, qty } of items) {
        const quantity = Math.floor(Number(qty))
        if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) throw new Error('Ogiltigt antal')
        let name, price
        if (Number(id) >= STUDIO_CART_ID) {
            name = 'Egen design-mugg (BrewCoff Studio)'
            price = STUDIO_PRICE
        } else {
            const product = products.find(p => p.id === Number(id))
            if (!product) throw new Error('Produkten finns inte längre: ' + id)
            name = product.name
            price = product.price
        }
        subtotal += price * quantity
        lines.push({
            quantity,
            price_data: {
                currency: 'sek',
                unit_amount: Math.round(price * 100), // Stripe räknar i öre
                product_data: { name }
            }
        })
    }
    return { lines, subtotal }
}

// ===== Routes =====
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Skapa en betalning och returnera länken till Stripes betalsida
app.post('/api/checkout', async (req, res) => {
    try {
        const items = req.body?.items
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Varukorgen är tom' })
        }
        const { lines, subtotal } = await buildLineItems(items)
        const shipping = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_COST

        // Skicka bara tillbaka kunden till en adress vi känner igen.
        // returnUrl behövs för GitHub Pages, där sidan ligger under /<repo>/
        const wanted = String(req.body.returnUrl || req.headers.origin || '').replace(/\/$/, '')
        const base = CLIENT_URLS.find(u => wanted === u || wanted.startsWith(u + '/')) ? wanted : CLIENT_URLS[0]

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: lines,
            shipping_options: [{
                shipping_rate_data: {
                    type: 'fixed_amount',
                    display_name: shipping === 0 ? 'Fri frakt' : 'Frakt',
                    fixed_amount: { amount: shipping * 100, currency: 'sek' }
                }
            }],
            customer_email: req.body.email || undefined,
            metadata: { userId: req.body.userId || 'gäst' },
            success_url: `${base}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${base}/?checkout=cancel`
        })
        res.json({ url: session.url })
    } catch (err) {
        console.error('checkout:', err.message)
        res.status(400).json({ error: err.message })
    }
})

// Kontrollera en betalning när kunden kommer tillbaka från Stripe
app.get('/api/checkout/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
            expand: ['line_items', 'payment_intent.latest_charge']
        })
        res.json({
            id: session.id,
            paid: session.payment_status === 'paid',
            total: session.amount_total / 100,
            email: session.customer_details?.email || null,
            receiptUrl: session.payment_intent?.latest_charge?.receipt_url || null,
            items: session.line_items.data.map(li => ({
                name: li.description,
                qty: li.quantity,
                price: li.price.unit_amount / 100
            }))
        })
    } catch (err) {
        console.error('verify:', err.message)
        res.status(404).json({ error: 'Hittade ingen betalning' })
    }
})

// ===== Frontend =====
// I produktion (Render) serverar Express även den byggda React-appen från dist/.
// Lokalt kör ni Vite som vanligt, då finns inget behov av detta.
const DIST = fileURLToPath(new URL('../dist', import.meta.url))
if (existsSync(DIST)) app.use(express.static(DIST))

app.listen(PORT, () => {
    console.log(`BrewCoff-servern kör på http://localhost:${PORT}`)
    console.log('Tillåtna frontend-adresser:', CLIENT_URLS.join(', '))
})
