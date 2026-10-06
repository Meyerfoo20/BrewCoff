// localStorage-hjälp + kontoregistrat, köphistorik och varukorgslagring

import {
    CART_STORAGE_KEY,
    STUDIO_CART_ID,
    STUDIO_PRICE,
    products
} from '../data/products.js'
import { db } from './firebase.js'
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where
} from 'firebase/firestore'

export function storageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
}

export function storageSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* lagret fullt – ignorera */ }
}

export function storageRemove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
}

export async function loadUserProfile(uid) {
    const snapshot = await getDoc(doc(db, 'users', uid));
    return snapshot.exists() ? snapshot.data() : null;
}

export function saveUserProfile(uid, profile) {
    return setDoc(doc(db, 'users', uid), {
        ...profile,
        updatedAt: serverTimestamp()
    }, { merge: true });
}

export async function loadOrders(uid) {
    const snapshot = await getDocs(query(collection(db, 'orders'), where('userId', '==', uid)));
    return snapshot.docs
        .map(order => ({ id: order.id, ...order.data() }))
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function saveOrder(uid, order) {
    return addDoc(collection(db, 'orders'), { ...order, userId: uid, createdAt: serverTimestamp() });
}

// ===== Lagrad varukorg =====

function normalizeCart(saved) {
    const cart = [];
    if (!Array.isArray(saved)) return cart;
    saved.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product && item.qty > 0) {
            cart.push({ ...product, qty: item.qty });
        } else if (item.id >= STUDIO_CART_ID && item.qty > 0) {
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
    return cart;
}

export function loadCartFromStorage() {
    try {
        const saved = JSON.parse(storageGet(CART_STORAGE_KEY) || '[]');
        return normalizeCart(saved);
    } catch (e) { return []; }
}

export async function loadCart(uid) {
    const snapshot = await getDoc(doc(db, 'carts', uid));
    return snapshot.exists() ? normalizeCart(snapshot.data().items) : null;
}

export function saveCart(uid, items) {
    return setDoc(doc(db, 'carts', uid), { items, updatedAt: serverTimestamp() });
}
