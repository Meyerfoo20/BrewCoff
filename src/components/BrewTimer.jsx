// Bryggtimer: nedräkning med setInterval (rensas i useEffect-cleanup)

import { useEffect, useRef, useState } from 'react'

const PRESETS = [30, 2 * 60, 4 * 60, 12 * 60];

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ':' + String(s).padStart(2, '0');
}

// Kort pling när kaffet är klart (tyst om ljud inte stöds/blockeras)
function playDing() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
        osc.onended = () => ctx.close();
    } catch (e) { /* inget ljud */ }
}

export default function BrewTimer({ drink, initialSeconds, onClose }) {
    const [total, setTotal] = useState(initialSeconds);
    const [remaining, setRemaining] = useState(initialSeconds);
    const [running, setRunning] = useState(false);
    const endAt = useRef(0);

    useEffect(() => {
        if (!running) return
        const id = setInterval(() => {
            const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
            setRemaining(left);
            if (left === 0) {
                setRunning(false);
                playDing();
            }
        }, 250);
        return () => clearInterval(id);
    }, [running]);

    // Visa nedräkningen i fliktiteln medan timern går
    useEffect(() => {
        if (!running && remaining !== 0) return
        const original = document.title;
        document.title = remaining === 0 ? 'Klart! – BrewCoff' : formatTime(remaining) + ' – ' + drink.title;
        return () => { document.title = original; };
    }, [running, remaining, drink.title]);

    function start() {
        const from = remaining === 0 ? total : remaining;
        endAt.current = Date.now() + from * 1000;
        setRemaining(from);
        setRunning(true);
    }

    function reset(seconds) {
        setRunning(false);
        setTotal(seconds);
        setRemaining(seconds);
    }

    const done = remaining === 0;
    const progress = total > 0 ? 1 - remaining / total : 0;

    return (
        <div className={done ? 'brew-timer done' : 'brew-timer'} role="timer" aria-live={done ? 'assertive' : 'off'}>
            <div className="brew-timer-header">
                <span className="brew-timer-title">Bryggtimer · {drink.title}</span>
                <button type="button" className="brew-timer-close" onClick={onClose} aria-label="Stäng bryggtimern">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
            </div>
            <p className="brew-timer-time">{done ? 'Klart!' : formatTime(remaining)}</p>
            <div className="brew-timer-bar"><span style={{ width: (progress * 100) + '%' }} /></div>
            {done && <p className="brew-timer-done">Din {drink.title} är redo – häll upp i din favoritmugg.</p>}
            <div className="brew-timer-presets">
                {PRESETS.map(s => (
                    <button key={s} type="button" className={total === s ? 'active' : ''} onClick={() => reset(s)}>{formatTime(s)}</button>
                ))}
            </div>
            <div className="brew-timer-actions">
                <button type="button" className="btn-primary" onClick={running ? () => setRunning(false) : start}>
                    {running ? 'Pausa' : done ? 'Starta igen' : remaining < total ? 'Fortsätt' : 'Starta'}
                </button>
                <button type="button" className="brew-timer-reset" onClick={() => reset(total)}>Nollställ</button>
            </div>
        </div>
    );
}
