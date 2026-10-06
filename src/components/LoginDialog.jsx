// Inloggning (Rasmus)
//
// Demo-inloggning (ingen backend): en mejl reserveras som konto när den
// används första gången (sparas i localStorage). Samma mejl kräver samma
// lösenord; kontonamnet sparas/uppdateras vid inloggning. Admin kräver
// bekräftelsekoden 0005 när kontot skapas.

import { useEffect, useRef, useState } from 'react'
import { ADMIN_CODE, NAME_KEY, TYPE_LABELS } from '../data/products.js'
import { loadAccounts, saveAccounts, storageGet } from '../lib/storage.js'

export default function LoginDialog({ open, onClose, onSuccess }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [type, setType] = useState('kund')
    const [adminCode, setAdminCode] = useState('')
    const [error, setError] = useState('')
    const emailRef = useRef(null)

    // Nollställ formuläret (med tidigare kontonamn förifyllt) när dialogen öppnas
    useEffect(() => {
        if (!open) return
        setName(storageGet(NAME_KEY) || '')
        setEmail('')
        setPassword('')
        setType('kund')
        setAdminCode('')
        setError('')
        const t = setTimeout(() => {
            if (emailRef.current) emailRef.current.focus();
        }, 0);
        return () => clearTimeout(t);
    }, [open]);

    // Escape stänger
    useEffect(() => {
        if (!open) return
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    function handleSubmit(e) {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();
        // E-post och lösenord är obligatoriska
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || password.length === 0) {
            setError('Ange en giltig e-post och ett lösenord');
            return;
        }
        const accounts = loadAccounts();
        if (accounts[trimmedEmail]) {
            // Reserverad mejl: kräver samma lösenord, kontotypen behålls
            // och kontonamnet sparas/uppdateras
            if (password !== accounts[trimmedEmail].password) {
                setError('Fel lösenord för denna e-post');
                return;
            }
            if (trimmedName) accounts[trimmedEmail].name = trimmedName;
        } else {
            // Ny mejl -> reserveras som ett nytt konto
            if (type === 'admin' && adminCode.trim() !== ADMIN_CODE) {
                setError('Fel adminkod');
                return;
            }
            accounts[trimmedEmail] = { password: password, name: trimmedName, type: type };
        }
        saveAccounts(accounts);
        const account = accounts[trimmedEmail];
        onSuccess({ email: trimmedEmail, name: account.name || '', type: account.type });
    }

    return (
        <div className={open ? 'login-overlay open' : 'login-overlay'} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="login-dialog" role="dialog" aria-modal="true" aria-labelledby="loginTitle">
                <div className="login-header">
                    <h2 id="loginTitle">Logga in</h2>
                    <button className="login-close" type="button" aria-label="Stäng inloggning" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="loginName">Kontonamn</label>
                    <input type="text" id="loginName" value={name} onChange={e => setName(e.target.value)} placeholder="T.ex. Anna" autoComplete="name" maxLength={30} />
                    <label htmlFor="loginEmail">E-post</label>
                    <input type="email" id="loginEmail" ref={emailRef} value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" placeholder="din@epost.se" />
                    <label htmlFor="loginPassword">Lösenord</label>
                    <input type="password" id="loginPassword" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" />
                    <p className="login-type-label">Kontotyp</p>
                    <div className="login-types">
                        {Object.keys(TYPE_LABELS).map(t => (
                            <label key={t} className={type === t ? 'login-type selected' : 'login-type'}>
                                <input type="radio" name="loginType" value={t} checked={type === t} onChange={() => setType(t)} />
                                <span>{TYPE_LABELS[t]}</span>
                            </label>
                        ))}
                    </div>
                    {type === 'admin' && (
                        <input type="text" id="loginAdminCode" value={adminCode} onChange={e => setAdminCode(e.target.value)} placeholder="Adminkod (krävs för admin)" maxLength={4} inputMode="numeric" autoComplete="off" />
                    )}
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="btn-primary">Logga in</button>
                </form>
            </div>
        </div>
    );
}
