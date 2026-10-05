// BrewCoff Studio – custom mugg (Jakob)
//
// Canvas-förhandsvisningen ritar om när designen ändras och när
// bilder/webfonts är klara (subscribeAssets i lib/studio.js).

import { useEffect, useRef, useState } from 'react'
import {
    STUDIO_PRICE,
    STUDIO_MUG_COLORS,
    STUDIO_TEXT_COLORS
} from '../data/products.js'
import {
    defaultStudioState,
    drawMugDesign,
    downscaleToDataURL,
    studioDesignId,
    studioDesignSnapshot,
    studioDesignSummary,
    subscribeAssets,
    thumbnailFromCanvas
} from '../lib/studio.js'

export default function Studio({ onAddToCart }) {
    const [state, setState] = useState(defaultStudioState)
    const [status, setStatus] = useState(null)
    const canvasRef = useRef(null)
    const fileRef = useRef(null)
    const statusTimer = useRef(null)

    // Rita om förhandsvisningen – även när muggbilden/webfonts laddats färdigt
    useEffect(() => {
        const redraw = () => {
            const canvas = canvasRef.current
            if (canvas) drawMugDesign(canvas, state);
        };
        redraw();
        return subscribeAssets(redraw);
    }, [state]);

    useEffect(() => () => { if (statusTimer.current) clearTimeout(statusTimer.current); }, []);

    function showStatus(msg, isError) {
        setStatus({ msg, isError });
        if (statusTimer.current) clearTimeout(statusTimer.current);
        if (msg) {
            statusTimer.current = setTimeout(() => setStatus(null), 4000);
        }
    }

    function handleFile(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            setState(s => ({ ...s, uploadedDataURL: ev.target.result, fileName: file.name }));
        };
        reader.readAsDataURL(file);
    }

    function handleReset() {
        setState(defaultStudioState());
        if (fileRef.current) fileRef.current.value = '';
        showStatus('Designen är återställd.');
    }

    function handleAddToCart() {
        const design = studioDesignSnapshot(state);
        if (state.mode === 'image' && state.uploadedDataURL) {
            // Downscajad bild som data-URL – klarar localStorage och taintar
            // inte canvasen (data-URL är same-origin)
            design.image = downscaleToDataURL(state.uploadedDataURL, 240) || state.uploadedDataURL;
        }
        const item = {
            id: studioDesignId(state),
            name: 'BrewCoff Custom Mugg',
            category: 'motiv',
            price: STUDIO_PRICE,
            desc: studioDesignSummary(state),
            design,
            qty: 1
        };
        // Miniatyrbild direkt från canvasen (fallback om exporten misslyckas)
        const canvas = canvasRef.current;
        const thumb = canvas ? thumbnailFromCanvas(canvas, 220) : null;
        if (thumb) item.image = thumb;
        onAddToCart(item);
    }

    return (
        <section id="studio" className="custom-studio-section">
            <div className="studio-wrap">
                <div className="studio-header">
                    <span className="studio-eyebrow">BrewCoff Studio</span>
                    <h2>Tillverka din egen mugg</h2>
                    <p>Skriv din egen text eller ladda upp en bild – vi trycker den på en klassisk BrewCoff-porslinsmugg i färgen du vill.</p>
                </div>

                <div className="studio-card">
                    <div className="studio-preview">
                        <canvas ref={canvasRef} id="studioCanvas" width="660" height="660"></canvas>
                        <span className="studio-preview-note">Förhandsvisning</span>
                    </div>

                    <div className="studio-controls">
                        <div className="studio-field">
                            <label>1. Välj design</label>
                            <div className="studio-seg">
                                <button type="button" className={'studio-seg-btn' + (state.mode === 'text' ? ' active' : '')} onClick={() => setState(s => ({ ...s, mode: 'text' }))}>Text</button>
                                <button type="button" className={'studio-seg-btn' + (state.mode === 'image' ? ' active' : '')} onClick={() => setState(s => ({ ...s, mode: 'image' }))}>Egen bild</button>
                            </div>

                            {state.mode === 'text' ? (
                                <div className="studio-mode-panel" id="studioTextPanel">
                                    <div className="studio-input-row">
                                        <input type="text" id="studioText" maxLength="32" placeholder="Skriv din text, t.ex. Världens bästa mamma" value={state.text} onChange={e => setState(s => ({ ...s, text: e.target.value }))} />
                                        <span className="studio-counter" id="studioCounter">{state.text.length}/32</span>
                                    </div>
                                    <div className="studio-range-row">
                                        <label htmlFor="studioFontSize">Storlek</label>
                                        <input type="range" id="studioFontSize" min="24" max="72" value={state.fontSize} onChange={e => setState(s => ({ ...s, fontSize: parseInt(e.target.value, 10) }))} />
                                    </div>
                                    <select className="studio-select" id="studioFont" value={state.font} onChange={e => setState(s => ({ ...s, font: e.target.value }))}>
                                        <option value="serif">Elegant serif</option>
                                        <option value="serif-italic">Kursiv serif</option>
                                        <option value="sans">Modern sans</option>
                                    </select>
                                </div>
                            ) : (
                                <div className="studio-mode-panel" id="studioImagePanel">
                                    <label className="studio-dropzone" htmlFor="studioFile">
                                        <input type="file" id="studioFile" ref={fileRef} accept="image/*" onChange={handleFile} hidden />
                                        <span className="studio-dropzone-icon">🖼️</span>
                                        <span>Ladda upp en bild (PNG eller JPG)</span>
                                        <small>Skärpast: logotyper och icikoner med tydlig kontur</small>
                                    </label>
                                    <span className="studio-filename" id="studioFileName">{state.fileName}</span>
                                </div>
                            )}
                        </div>

                        <div className="studio-field">
                            <label>2. Muggfärg</label>
                            <div className="studio-swatches">
                                {STUDIO_MUG_COLORS.map(color => (
                                    <button key={color.id} type="button" className={'studio-swatch' + (state.mugColorId === color.id ? ' active' : '')} style={{ background: color.hex }} data-color-id={color.id} title={color.label} aria-label={'Muggfärg ' + color.label} onClick={() => setState(s => ({ ...s, mugColorId: color.id }))}></button>
                                ))}
                            </div>
                        </div>

                        <div className={'studio-field' + (state.mode !== 'text' ? ' hidden' : '')} id="studioTextColorField">
                            <label>3. Tryckfärg</label>
                            <div className="studio-swatches">
                                {STUDIO_TEXT_COLORS.map(color => (
                                    <button key={color.id} type="button" className={'studio-swatch' + (state.textColor === color.hex ? ' active' : '')} style={{ background: color.hex }} data-color-id={color.id} title={color.label} aria-label={'Tryckfärg ' + color.label} onClick={() => setState(s => ({ ...s, textColor: color.hex }))}></button>
                                ))}
                            </div>
                        </div>

                        <div className="studio-actions">
                            <div className="studio-price">
                                <strong>{STUDIO_PRICE} kr</strong>
                                <span>inkl. tryck</span>
                            </div>
                            <div className="studio-btns">
                                <button type="button" className="studio-btn-primary" onClick={handleAddToCart}>Lägg till i varukorg</button>
                            </div>
                            <button type="button" className="studio-reset" onClick={handleReset}>Återställ design</button>
                            {status && <p className={'studio-status' + (status.isError ? ' error' : '')} id="studioStatus">{status.msg}</p>}
                            <p className="studio-fineprint">Leveranstid för personliga muggar: 5–7 dagar. Förhandsvisningen är en guide – det slutliga trycket kan variera något.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
