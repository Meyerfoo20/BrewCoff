// Kontovyn (Rasmus)

import { Fragment, useEffect, useRef, useState } from 'react'
import { TYPE_LABELS } from '../data/products.js'
import { formatKr } from '../lib/cart.js'
import { loadOrders, saveUserProfile } from '../lib/storage.js'

export default function AccountDialog({ open, user, onClose, onNameSaved }) {
    const [orders, setOrders] = useState([]);
    const [nameEditing, setNameEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const nameInputRef = useRef(null);

    // Läs köphistoriken och stäng namnredigeringen när dialogen öppnas
    useEffect(() => {
        if (!open || !user) return
        let active = true;
        loadOrders(user.uid)
            .then(savedOrders => { if (active) setOrders(savedOrders); })
            .catch(() => { if (active) setOrders([]); });
        setNameEditing(false);
        return () => { active = false; };
    }, [open, user]);

    // Escape stänger först redigeringen, sedan kontovynen
    useEffect(() => {
        if (!open) return
        const onKey = (e) => {
            if (e.key !== 'Escape') return;
            if (nameEditing) setNameEditing(false);
            else onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, nameEditing, onClose]);

    // Fokusera + markera namnfältet vid redigering
    useEffect(() => {
        if (nameEditing && nameInputRef.current) {
            nameInputRef.current.focus();
            nameInputRef.current.select();
        }
    }, [nameEditing]);

    function startNameEdit() {
        if (!user) return
        setEditName((user.name) || '');
        setNameEditing(true);
    }

    async function saveNameEdit() {
        if (!user) { setNameEditing(false); return; }
        const name = editName.trim();
        try {
            await saveUserProfile(user.uid, { name });
            setNameEditing(false);
            onNameSaved(name);
        } catch (saveError) {
            window.alert('Kunde inte spara kontonamnet. Försök igen.');
        }
    }

    return (
        <div className={open ? 'login-overlay open' : 'login-overlay'} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="login-dialog" role="dialog" aria-modal="true" aria-labelledby="accountTitle">
                <div className="login-header">
                    <h2 id="accountTitle">Konto</h2>
                    <button className="login-close" type="button" aria-label="Stäng kontovyn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                {user && (
                    <>
                        <div className="account-section">
                            <p className="account-row"><span className="account-label">Kontonamn</span>
                                <span className="account-name-wrap">
                                    {!nameEditing
                                        ? <span className="account-value">{user.name || '–'}</span>
                                        : <input type="text" className="account-name-input" ref={nameInputRef} value={editName} onChange={e => setEditName(e.target.value)} maxLength={30}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveNameEdit(); } }} />}
                                    {!nameEditing
                                        ? <button className="account-edit-btn" type="button" onClick={startNameEdit} aria-label="Redigera kontonamn">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                        </button>
                                        : <button className="account-edit-btn" type="button" onClick={saveNameEdit} aria-label="Spara kontonamn">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="20 6 9 17 4 12" /></svg>
                                        </button>}
                                </span>
                            </p>
                            <p className="account-row"><span className="account-label">E-post</span><span className="account-value">{user.email}</span></p>
                            <p className="account-row"><span className="account-label">Kontotyp</span><span className="account-value">{TYPE_LABELS[user.type] || TYPE_LABELS.kund}</span></p>
                            <p className="account-row"><span className="account-label">Roll</span><span className="account-value">{user.role === 'admin' ? 'Admin' : 'User'}</span></p>
                        </div>
                        <div className="account-section">
                            <h3 className="account-purchases-title">Tidigare köp</h3>
                            <div className="account-purchases">
                                {orders.length === 0
                                    ? <p className="account-empty">Inga köp ännu.</p>
                                    : orders.map((order, i) => (
                                        <div className="account-order" key={i}>
                                            <p className="account-order-date">{new Date(order.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            <p className="account-order-items">
                                                {(order.items || []).map((item, j) => (
                                                    <Fragment key={j}>{item.qty}× {item.name} – {formatKr(item.price * item.qty)}<br /></Fragment>
                                                ))}
                                            </p>
                                            <p className="account-order-total">Totalt: {formatKr(order.total)}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
