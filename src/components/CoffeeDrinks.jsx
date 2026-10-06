// Kaffedrycker från externt API: sök/filter, favoriter, slumpa och bryggtimer

import { useCallback, useEffect, useMemo, useState } from 'react'
import { brewSeconds, fetchDrinks, loadFavorites, saveFavorites } from '../lib/coffeeApi.js'
import BrewTimer from './BrewTimer.jsx'

const DRINK_FILTERS = [
    { id: 'all', label: 'Alla' },
    { id: 'hot', label: 'Varmt' },
    { id: 'iced', label: 'Iskaffe' },
    { id: 'favorites', label: 'Favoriter' }
];

const FALLBACK_IMAGE = 'Images/Stock-Mugg.png';

function HeartIcon({ filled }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={filled ? 'filled' : ''}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

function DrinkImage({ src, alt }) {
    const [failed, setFailed] = useState(false);
    useEffect(() => setFailed(false), [src]);
    return (
        <img src={!src || failed ? FALLBACK_IMAGE : src} alt={alt} loading="lazy"
            className={!src || failed ? 'drink-img fallback' : 'drink-img'} onError={() => setFailed(true)} />
    );
}

function DrinkCard({ drink, favorite, featured, onToggleFavorite, onStartTimer, onOpen }) {
    return (
        <article className={featured ? 'drink-card featured' : 'drink-card'}>
            <div className="drink-img-wrapper drink-clickable" onClick={() => onOpen(drink.key)}>
                <DrinkImage src={drink.image} alt={drink.title} />
                <span className="product-badge">{drink.temp === 'iced' ? 'Iskaffe' : 'Varmt'}</span>
                <button type="button" className={favorite ? 'drink-fav-btn active' : 'drink-fav-btn'} onClick={e => { e.stopPropagation(); onToggleFavorite(drink.key); }}
                    aria-pressed={favorite} aria-label={(favorite ? 'Ta bort ' : 'Spara ') + drink.title + (favorite ? ' från favoriter' : ' som favorit')}>
                    <HeartIcon filled={favorite} />
                </button>
            </div>
            <div className="drink-body">
                {featured && <span className="section-tag drink-featured-tag">Dagens kaffe</span>}
                <h3 className="drink-title"><button type="button" className="drink-title-btn" onClick={() => onOpen(drink.key)}>{drink.title}</button></h3>
                <p className="drink-desc">{drink.description}</p>
                <ul className="drink-ingredients">
                    {drink.ingredients.map(i => <li key={i}>{i}</li>)}
                </ul>
                <div className="drink-actions">
                    <button type="button" className="drink-timer-btn" onClick={() => onOpen(drink.key)}>Visa ingredienser</button>
                    <TimerButton onClick={() => onStartTimer(drink)} />
                </div>
            </div>
        </article>
    );
}

function TimerButton({ onClick }) {
    return (
        <button type="button" className="drink-timer-btn" onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M9 2h6" /></svg>
            Bryggtimer
        </button>
    );
}

// Detaljvy för en dryck: hela beskrivningen + ingredienslistan
function DrinkDialog({ drink, favorite, onClose, onToggleFavorite, onStartTimer }) {
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        document.body.classList.add('login-open');
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.classList.remove('login-open');
        };
    }, [onClose]);

    return (
        <div className="login-overlay open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="login-dialog drink-dialog" role="dialog" aria-modal="true" aria-labelledby="drinkDialogTitle">
                <div className="drink-dialog-img">
                    <DrinkImage src={drink.image} alt={drink.title} />
                    <button className="login-close drink-dialog-close" type="button" aria-label="Stäng" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <div className="drink-dialog-body">
                    <span className="section-tag">{drink.temp === 'iced' ? 'Iskaffe' : 'Varm dryck'}</span>
                    <h2 id="drinkDialogTitle">{drink.title}</h2>
                    <p className="drink-dialog-desc">{drink.description}</p>
                    <h3 className="drink-dialog-subtitle">Ingredienser</h3>
                    <ul className="drink-dialog-ingredients">
                        {drink.ingredients.map(i => <li key={i}>{i}</li>)}
                    </ul>
                    <div className="drink-actions">
                        <button type="button" className={favorite ? 'drink-timer-btn active' : 'drink-timer-btn'} onClick={() => onToggleFavorite(drink.key)} aria-pressed={favorite}>
                            <HeartIcon filled={favorite} />
                            {favorite ? 'Sparad som favorit' : 'Spara som favorit'}
                        </button>
                        <TimerButton onClick={() => { onStartTimer(drink); onClose(); }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CoffeeDrinks({ user }) {
    const [drinks, setDrinks] = useState([]);
    const [status, setStatus] = useState('loading'); // loading | ready | cached | error
    const [reloadKey, setReloadKey] = useState(0);
    const [filter, setFilter] = useState('all');
    const [query, setQuery] = useState('');
    const [favorites, setFavorites] = useState(() => loadFavorites(user?.uid));
    const [randomKey, setRandomKey] = useState(null);
    const [timerDrink, setTimerDrink] = useState(null);
    const [openKey, setOpenKey] = useState(null);

    // Hämta drycker från API:t (avbryts om komponenten tas bort)
    useEffect(() => {
        const controller = new AbortController();
        setStatus('loading');
        fetchDrinks(controller.signal)
            .then(({ drinks, fromCache }) => {
                setDrinks(drinks);
                setStatus(fromCache ? 'cached' : 'ready');
            })
            .catch(fetchError => {
                if (fetchError.name !== 'AbortError') setStatus('error');
            });
        return () => controller.abort();
    }, [reloadKey]);

    // Varje konto har sina egna favoriter
    useEffect(() => {
        setFavorites(loadFavorites(user?.uid));
    }, [user?.uid]);

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();
        return drinks.filter(d => {
            if (filter === 'favorites' && !favorites.includes(d.key)) return false;
            if (filter === 'hot' || filter === 'iced') { if (d.temp !== filter) return false; }
            if (!q) return true;
            return d.title.toLowerCase().includes(q) ||
                d.description.toLowerCase().includes(q) ||
                d.ingredients.some(i => i.toLowerCase().includes(q));
        });
    }, [drinks, filter, query, favorites]);

    const randomDrink = drinks.find(d => d.key === randomKey) || null;
    const openDrink = drinks.find(d => d.key === openKey) || null;
    const closeDrink = useCallback(() => setOpenKey(null), []);

    function toggleFavorite(key) {
        setFavorites(prev => {
            const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
            saveFavorites(user?.uid, next);
            return next;
        });
    }

    function clearFavorites() {
        if (!window.confirm('Ta bort alla sparade favoriter?')) return;
        setFavorites([]);
        saveFavorites(user?.uid, []);
    }

    // Slumpa en dryck – aldrig samma som förra gången
    function pickRandom() {
        if (drinks.length === 0) return;
        const pool = drinks.length > 1 ? drinks.filter(d => d.key !== randomKey) : drinks;
        setRandomKey(pool[Math.floor(Math.random() * pool.length)].key);
    }

    const favoriteCount = favorites.filter(k => drinks.some(d => d.key === k)).length;

    return (
        <section id="kaffedrycker" className="drinks-section">
            <div className="drinks-inner">
                <div className="drinks-header">
                    <span className="section-tag">Kaffedrycker</span>
                    <h2>Vad ska du brygga i din mugg?</h2>
                    <p>Inspiration från hela kaffevärlden – sök efter dryck eller ingrediens, spara dina favoriter och starta bryggtimern när det är dags.</p>
                </div>

                <div className="drinks-toolbar">
                    <div className="filter-pills">
                        {DRINK_FILTERS.map(f => (
                            <button key={f.id} type="button" className={'filter-pill' + (filter === f.id ? ' active' : '')} onClick={() => setFilter(f.id)}>
                                {f.label}{f.id === 'favorites' && favoriteCount > 0 ? ' (' + favoriteCount + ')' : ''}
                            </button>
                        ))}
                    </div>
                    <div className="drinks-toolbar-right">
                        <div className="search-box">
                            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                            <input type="text" placeholder="Sök dryck eller ingrediens..." value={query} onChange={e => setQuery(e.target.value)} aria-label="Sök kaffedrycker" />
                        </div>
                        <button type="button" className="btn-primary drinks-random-btn" onClick={pickRandom} disabled={drinks.length === 0}>
                            Slumpa en kaffe
                        </button>
                    </div>
                </div>

                {status === 'cached' && (
                    <p className="drinks-notice">Kunde inte nå API:t – visar senast sparade drycker. <button type="button" onClick={() => setReloadKey(k => k + 1)}>Försök igen</button></p>
                )}

                {randomDrink && (
                    <div className="drinks-featured">
                        <DrinkCard drink={randomDrink} featured favorite={favorites.includes(randomDrink.key)}
                            onToggleFavorite={toggleFavorite} onStartTimer={setTimerDrink} onOpen={setOpenKey} />
                        <button type="button" className="drinks-featured-close" onClick={() => setRandomKey(null)} aria-label="Dölj dagens kaffe">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                )}

                {status === 'loading' && <p className="drinks-empty">Hämtar kaffedrycker...</p>}
                {status === 'error' && (
                    <p className="drinks-empty">Kaffedryckerna kunde inte hämtas just nu. <button type="button" onClick={() => setReloadKey(k => k + 1)}>Försök igen</button></p>
                )}

                {(status === 'ready' || status === 'cached') && (
                    visible.length === 0 ? (
                        <p className="drinks-empty">
                            {filter === 'favorites' && !query ? 'Du har inga favoriter ännu – tryck på hjärtat på en dryck för att spara den.' : 'Inga drycker matchade din sökning.'}
                        </p>
                    ) : (
                        <div className="drinks-grid">
                            {visible.map(d => (
                                <DrinkCard key={d.key} drink={d} favorite={favorites.includes(d.key)}
                                    onToggleFavorite={toggleFavorite} onStartTimer={setTimerDrink} onOpen={setOpenKey} />
                            ))}
                        </div>
                    )
                )}

                {filter === 'favorites' && favoriteCount > 0 && (
                    <button type="button" className="drinks-clear-btn" onClick={clearFavorites}>Ta bort alla favoriter</button>
                )}

                <p className="drinks-source">Data: <a href="https://sampleapis.com/api-list/coffee" target="_blank" rel="noreferrer">Sample APIs – Coffee</a></p>
            </div>

            {openDrink && (
                <DrinkDialog drink={openDrink} favorite={favorites.includes(openDrink.key)} onClose={closeDrink}
                    onToggleFavorite={toggleFavorite} onStartTimer={setTimerDrink} />
            )}

            {timerDrink && (
                <BrewTimer key={timerDrink.key} drink={timerDrink} initialSeconds={brewSeconds(timerDrink)} onClose={() => setTimerDrink(null)} />
            )}
        </section>
    );
}
