// Inloggning (Rasmus)
//
// Nya e-postadresser registreras via Firebase Authentication.

import { useEffect, useRef, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { TYPE_LABELS } from '../data/products.js'
import { auth } from '../lib/firebase.js'
import { loadUserProfile, saveUserProfile } from '../lib/storage.js'

export default function LoginDialog({ open, onClose, onSuccess }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [type, setType] = useState('kund')
    const [error, setError] = useState('')
    const [busy, setBusy] = useState(false)
    const emailRef = useRef(null)

    // Nollställ formuläret (med tidigare kontonamn förifyllt) när dialogen öppnas
    useEffect(() => {
        if (!open) return
        setName('')
        setEmail('')
        setPassword('')
        setType('kund')
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

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();
        // E-post och lösenord är obligatoriska
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || password.length === 0) {
            setError('Ange en giltig e-post och ett lösenord');
            return;
        }
        setBusy(true);
        setError('');
        try {
            let credential;
            try {
                credential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
            } catch (createError) {
                if (createError.code !== 'auth/email-already-in-use') throw createError;
                credential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
            }

            const existing = await loadUserProfile(credential.user.uid);
            const profile = {
                email: trimmedEmail,
                name: trimmedName || existing?.name || '',
                type: existing?.type === 'foretag' ? 'foretag' : existing?.type === 'kund' ? 'kund' : type,
                role: existing?.role === 'admin' ? 'admin' : 'user'
            };
            await saveUserProfile(credential.user.uid, profile);
            onSuccess({ uid: credential.user.uid, ...profile });
        } catch (authError) {
            const messages = {
                'auth/invalid-credential': 'Fel e-post eller lösenord',
                'auth/wrong-password': 'Fel lösenord för denna e-post',
                'auth/weak-password': 'Lösenordet måste innehålla minst 6 tecken',
                'auth/invalid-email': 'Ange en giltig e-postadress',
                'auth/too-many-requests': 'För många försök. Försök igen senare.'
            };
            setError(messages[authError.code] || 'Kunde inte logga in. Kontrollera Firebase-inställningarna och försök igen.');
        } finally {
            setBusy(false);
        }
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
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={busy}>{busy ? 'Vänta...' : 'Logga in'}</button>
                </form>
            </div>
        </div>
    );
}
