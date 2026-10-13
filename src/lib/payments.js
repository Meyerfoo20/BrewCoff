// Stripe-betalning via vår egen backend (server/)
//
// I utveckling skickar Vite /api vidare till localhost:4242 (se vite.config.js).
// I produktion: sätt VITE_API_URL till backendens adress, t.ex. https://brewcoff-api.onrender.com

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function request(path, options) {
    let res
    try {
        res = await fetch(API_URL + path, options)
    } catch {
        throw new Error('Kunde inte nå servern – är backenden igång?')
    }
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || 'Något gick fel med betalningen')
    return data
}

// Skickar bara id + antal – priset bestäms av servern
export async function startCheckout(cart, user) {
    const { url } = await request('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            items: cart.map(item => ({ id: item.id, qty: item.qty })),
            email: user?.email,
            userId: user?.uid,
            // Var Stripe ska skicka tillbaka kunden (fungerar även under /<repo>/ på GitHub Pages)
            returnUrl: window.location.origin + window.location.pathname.replace(/index\.html$/, '')
        })
    })
    return url
}

export function verifyCheckout(sessionId) {
    return request('/api/checkout/' + encodeURIComponent(sessionId))
}
