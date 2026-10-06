// Kaffedrycker från Sample APIs (https://sampleapis.com/api-list/coffee)
//
// Senaste lyckade svaret sparas i localStorage så att sektionen
// fungerar även om API:t ligger nere.

import { storageGet, storageSet } from './storage.js'

const API_BASE = 'https://api.sampleapis.com/coffee/';
const CACHE_KEY = 'brewcoff-drinks-cache';
const FAVORITES_PREFIX = 'brewcoff-favorites:';

// API:t är öppet för alla att skriva till, så det finns testposter – filtrera bort dem
function cleanDrinks(list, temp) {
    if (!Array.isArray(list)) return [];
    return list
        .filter(d => typeof d.id === 'number'
            && typeof d.title === 'string' && d.title.trim()
            && !/test/i.test(d.title)
            && typeof d.description === 'string' && d.description.length > 20
            && Array.isArray(d.ingredients))
        .map(d => ({
            key: temp + '-' + d.id,
            title: d.title.trim(),
            description: d.description.trim(),
            ingredients: d.ingredients.filter(i => typeof i === 'string'),
            image: typeof d.image === 'string' && d.image.startsWith('https://') ? d.image : null,
            temp
        }));
}

async function fetchList(temp, signal) {
    const response = await fetch(API_BASE + temp, { signal });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return cleanDrinks(await response.json(), temp);
}

// Returnerar { drinks, fromCache }
export async function fetchDrinks(signal) {
    try {
        const [hot, iced] = await Promise.all([fetchList('hot', signal), fetchList('iced', signal)]);
        const drinks = [...hot, ...iced];
        if (drinks.length === 0) throw new Error('Tomt svar');
        storageSet(CACHE_KEY, JSON.stringify(drinks));
        return { drinks, fromCache: false };
    } catch (fetchError) {
        if (fetchError.name === 'AbortError') throw fetchError;
        const cached = JSON.parse(storageGet(CACHE_KEY) || 'null');
        if (Array.isArray(cached) && cached.length) return { drinks: cached, fromCache: true };
        throw fetchError;
    }
}

// Ungefärlig bryggtid i sekunder för timern
export function brewSeconds(drink) {
    const text = (drink.title + ' ' + drink.ingredients.join(' ')).toLowerCase();
    if (text.includes('cold brew')) return 12 * 60;
    if (text.includes('espresso')) return 30;
    if (/tea|chai|matcha/.test(text)) return 3 * 60;
    return 4 * 60; // pressbryggare
}

// ===== Favoriter (per konto, gäster delar "guest") =====

export function loadFavorites(uid) {
    try {
        const saved = JSON.parse(storageGet(FAVORITES_PREFIX + (uid || 'guest')) || '[]');
        return Array.isArray(saved) ? saved.filter(k => typeof k === 'string') : [];
    } catch (e) { return []; }
}

export function saveFavorites(uid, keys) {
    storageSet(FAVORITES_PREFIX + (uid || 'guest'), JSON.stringify(keys));
}
