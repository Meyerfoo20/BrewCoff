// localStorage-hjälp + kontoregistrat, köphistorik och varukorgslagring

import {
    ACCOUNTS_KEY,
    CART_STORAGE_KEY,
    ORDERS_PREFIX,
    STUDIO_CART_ID,
    STUDIO_PRICE,
    products
} from '../data/products.js'

export function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}

export function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* lagret fullt – ignorera */ }
}

export function storageRemove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
}

// ===== Kontoregistrat: reserverade mejl -> { password, name, type } =====

export function loadAccounts() {
    try {
        const saved = JSON.parse(storageGet(ACCOUNTS_KEY) || '{}');
        return (saved && typeof saved === 'object' && !Array.isArray(saved)) ? saved : {};
    } catch (err) { return {}; }
}

export function saveAccounts(accounts) {
    storageSet(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// ===== Köphistorik (Rasmus) =====

export function loadOrders(email) {
    try {
        const orders = JSON.parse(storageGet(ORDERS_PREFIX + email) || '[]');
        return Array.isArray(orders) ? orders : [];
    } catch (err) { return []; }
}

export function saveOrders(email, orders) {
    storageSet(ORDERS_PREFIX + email, JSON.stringify(orders));
}

// ===== Lagrad varukorg =====

export function loadCartFromStorage() {
    const cart = [];
    try {
        const raw = storageGet(CART_STORAGE_KEY);
        if (!raw) return cart;
        const saved = JSON.parse(raw);
        if (!Array.isArray(saved)) return cart;
        saved.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product && item.qty > 0) {
                cart.push({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    desc: product.desc,
                    image: product.image,
                    qty: item.qty
                });
            } else if (item.id >= STUDIO_CART_ID && item.qty > 0) {
                // Custom mugg från studio saknas i products – namn, pris,
                // beskrivning, miniatyrbild och design sparas på item själv
                cart.push({
                    id: item.id,
                    name: item.name || 'BrewCoff Custom Mugg',
                    category: 'motiv',
                    price: item.price || STUDIO_PRICE,
                    desc: item.desc,
                    image: item.image || 'Images/Stock-Mugg.png',
                    design: item.design || null,
                    qty: item.qty
                });
            }
        });
    } catch (e) { /* trasig sparad varukorg -> ignorera */ }
    return cart;
}
