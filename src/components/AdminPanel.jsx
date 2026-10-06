// Adminpanel: lägg till, ändra och ta bort produkter (endast role === 'admin')

import { useEffect, useState } from 'react'
import { FILTER_PILLS } from '../data/products.js'

const CATEGORIES = FILTER_PILLS.filter(p => p.cat !== 'all');

// Bilder som redan finns i public/Images
const IMAGE_OPTIONS = [
    'Images/Stock-Mugg.png',
    'Images/brewcoff-mugg.png',
    'Images/brewcoff-mugg-half.png',
    'Images/brewcoff-mugg-onemore.png',
    'Images/brewcoff-mugg-fika.png',
    'Images/brewcoff-mugg-irish.png',
    'Images/coffe-filter.png'
];

const EMPTY_FORM = { id: null, name: '', category: CATEGORIES[0].cat, price: '', desc: '', image: IMAGE_OPTIONS[0] };

// Uppladdad bild skalas ner till en data-URL (ryms i ett Firestore-dokument)
function fileToDataURL(file, maxSize) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('Ogiltig bild'));
            img.onload = () => {
                const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
                const canvas = document.createElement('canvas');
                canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
                canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL('image/webp', 0.85));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

function PriceInput({ product, disabled, onSave }) {
    const [value, setValue] = useState(String(product.price));
    useEffect(() => setValue(String(product.price)), [product.price]);

    function commit() {
        const price = Number(value);
        if (!(price > 0)) { setValue(String(product.price)); return; }
        if (price !== product.price) onSave({ ...product, price });
    }

    return (
        <label className="admin-price">
            <input type="number" min="1" step="1" value={value} disabled={disabled} aria-label={'Pris för ' + product.name}
                onChange={e => setValue(e.target.value)} onBlur={commit}
                onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
            <span>kr</span>
        </label>
    );
}

export default function AdminPanel({ open, products, onClose, onSave, onDelete }) {
    const [form, setForm] = useState(null); // null = listvyn
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) return
        setForm(null);
        setError('');
    }, [open]);

    // Escape stänger först formuläret, sedan panelen
    useEffect(() => {
        if (!open) return
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            if (form) setForm(null);
            else onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, form, onClose]);

    async function run(action) {
        setBusy(true);
        setError('');
        try {
            await action();
            return true;
        } catch (actionError) {
            setError(actionError.code === 'permission-denied'
                ? 'Saknar behörighet – kontrollera att kontot är admin och att Firestore-reglerna är publicerade.'
                : 'Något gick fel: ' + (actionError.message || 'okänt fel'));
            return false;
        } finally {
            setBusy(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const price = Number(form.price);
        if (!form.name.trim()) { setError('Ange ett produktnamn'); return; }
        if (!(price > 0)) { setError('Ange ett pris större än 0'); return; }
        const ok = await run(() => onSave({ ...form, price }));
        if (ok) setForm(null);
    }

    async function handleImageUpload(e) {
        const file = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!file) return;
        try {
            const image = await fileToDataURL(file, 500);
            setForm(f => ({ ...f, image }));
        } catch (uploadError) {
            setError('Bilden kunde inte läsas in');
        }
    }

    function handleDelete(product) {
        if (!window.confirm('Ta bort "' + product.name + '"' + (product.desc ? ' (' + product.desc + ')' : '') + '?')) return;
        run(() => onDelete(product.id));
    }

    const isCustomImage = form && !IMAGE_OPTIONS.includes(form.image);

    return (
        <div className={open ? 'login-overlay open' : 'login-overlay'} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="login-dialog admin-dialog" role="dialog" aria-modal="true" aria-labelledby="adminTitle">
                <div className="login-header">
                    <h2 id="adminTitle">{form ? (form.id === null ? 'Ny produkt' : 'Redigera produkt') : 'Admin – produkter'}</h2>
                    <button className="login-close" type="button" aria-label="Stäng adminpanelen" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {error && <p className="login-error admin-error">{error}</p>}

                {!form ? (
                    <>
                        <button type="button" className="btn-primary admin-add-btn" disabled={busy} onClick={() => { setError(''); setForm(EMPTY_FORM); }}>+ Lägg till produkt</button>
                        <ul className="admin-list">
                            {products.map(p => (
                                <li key={p.id} className="admin-row">
                                    <img src={p.image} alt="" className="admin-thumb" />
                                    <div className="admin-row-info">
                                        <span className="admin-row-name">{p.name}</span>
                                        <span className="admin-row-meta">{(CATEGORIES.find(c => c.cat === p.category) || {}).label || p.category}{p.desc ? ' · ' + p.desc : ''}</span>
                                    </div>
                                    <PriceInput product={p} disabled={busy} onSave={product => run(() => onSave(product))} />
                                    <div className="admin-row-actions">
                                        <button type="button" className="account-edit-btn" disabled={busy} aria-label={'Redigera ' + p.name}
                                            onClick={() => { setError(''); setForm({ ...p, price: String(p.price) }); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                        </button>
                                        <button type="button" className="account-edit-btn admin-delete-btn" disabled={busy} aria-label={'Ta bort ' + p.name} onClick={() => handleDelete(p)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {products.length === 0 && <li className="account-empty">Inga produkter.</li>}
                        </ul>
                    </>
                ) : (
                    <form className="admin-form" onSubmit={handleSubmit} noValidate>
                        <label htmlFor="adminName">Namn</label>
                        <input id="adminName" type="text" value={form.name} maxLength={60} autoFocus onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

                        <div className="admin-form-pair">
                            <div>
                                <label htmlFor="adminPrice">Pris (kr)</label>
                                <input id="adminPrice" type="number" min="1" step="1" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                            </div>
                            <div>
                                <label htmlFor="adminCategory">Kategori</label>
                                <select id="adminCategory" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {CATEGORIES.map(c => <option key={c.cat} value={c.cat}>{c.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <label htmlFor="adminDesc">Beskrivning</label>
                        <textarea id="adminDesc" rows={3} maxLength={300} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />

                        <label htmlFor="adminImage">Bild</label>
                        <div className="admin-image-pick">
                            <img src={form.image} alt="" className="admin-thumb admin-thumb-lg" />
                            <div className="admin-image-controls">
                                <select id="adminImage" value={isCustomImage ? '__custom' : form.image} onChange={e => { if (e.target.value !== '__custom') setForm(f => ({ ...f, image: e.target.value })); }}>
                                    {IMAGE_OPTIONS.map(src => <option key={src} value={src}>{src.replace('Images/', '')}</option>)}
                                    {isCustomImage && <option value="__custom">Uppladdad bild</option>}
                                </select>
                                <label className="admin-upload">
                                    Ladda upp egen bild
                                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" className="admin-cancel-btn" disabled={busy} onClick={() => { setError(''); setForm(null); }}>Avbryt</button>
                            <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Sparar...' : 'Spara'}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
