// Produktkatalog i Firestore (admin kan lägga till/ändra/ta bort)
//
// Är samlingen tom används standardlistan i data/products.js. Första
// gången en admin sparar en ändring kopieras standardlistan till Firestore.

import { products as defaultProducts, STUDIO_CART_ID } from '../data/products.js'
import { db } from './firebase.js'
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
    writeBatch
} from 'firebase/firestore'

function cleanProduct(p) {
    return {
        id: Number(p.id),
        name: String(p.name || '').trim(),
        category: p.category,
        price: Number(p.price),
        desc: String(p.desc || '').trim(),
        image: p.image || 'Images/Stock-Mugg.png'
    };
}

// Returnerar { items, fromCloud } – fromCloud=false betyder att standardlistan används
export async function loadProducts() {
    const snapshot = await getDocs(collection(db, 'products'));
    if (snapshot.empty) return { items: defaultProducts, fromCloud: false };
    const items = snapshot.docs
        .map(d => cleanProduct({ ...d.data(), id: d.data().id ?? d.id }))
        .sort((a, b) => a.id - b.id);
    return { items, fromCloud: true };
}

export async function seedProducts(items) {
    const batch = writeBatch(db);
    items.forEach(p => batch.set(doc(db, 'products', String(p.id)), cleanProduct(p)));
    await batch.commit();
}

export async function saveProduct(product) {
    const clean = cleanProduct(product);
    await setDoc(doc(db, 'products', String(clean.id)), clean);
    return clean;
}

export function deleteProduct(id) {
    return deleteDoc(doc(db, 'products', String(id)));
}

// Nästa lediga id (måste ligga under studio-muggarnas id-intervall)
export function nextProductId(items) {
    const id = items.reduce((m, p) => Math.max(m, p.id), 0) + 1;
    if (id >= STUDIO_CART_ID) throw new Error('Inga lediga produkt-id kvar');
    return id;
}
