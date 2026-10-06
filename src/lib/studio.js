// Canvas-rendering + designhjälp för BrewCoff Studio (Jakob)
//
// Muggbilden laddas en gång och delas av alla canvas-renderingar
// (studions stora canvas 660px och varukorgens mini-canvasar 76px).
// bumpAssets() meddelar React att en bild är klar så canvasarna ritar om.

import {
    STUDIO_CART_ID,
    STUDIO_FONTS,
    STUDIO_MUG_COLORS,
    STUDIO_PRINT_BOX
} from '../data/products.js'

const assetListeners = new Set();
function bumpAssets() { assetListeners.forEach(fn => fn()); }

// Registreras av komponenter som behöver veta när bilder/webfonts är klara
export function subscribeAssets(fn) {
    assetListeners.add(fn);
    return () => assetListeners.delete(fn);
}

const mugImg = new Image();
mugImg.onload = () => bumpAssets();
mugImg.onerror = () => bumpAssets();
mugImg.src = 'Images/Stock-Mugg.png';

// Liten cache för data-URL-bilder (uppladdade bilder + miniatyrer)
const imgCache = new Map();
export function getImage(dataUrl) {
    let img = imgCache.get(dataUrl);
    if (!img) {
        img = new Image();
        img.onload = () => bumpAssets();
        img.src = dataUrl;
        imgCache.set(dataUrl, img);
    }
    return img;
}

// Downscajad bild som data-URL – klarar localStorage och taintar
// inte canvasen (data-URL är same-origin)
export function downscaleToDataURL(dataUrl, maxSize) {
    const img = getImage(dataUrl);
    if (!img.complete || !img.naturalWidth) return null;
    try {
        const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
        const off = document.createElement('canvas');
        off.width = Math.max(1, Math.round(img.naturalWidth * scale));
        off.height = Math.max(1, Math.round(img.naturalHeight * scale));
        off.getContext('2d').drawImage(img, 0, 0, off.width, off.height);
        return off.toDataURL('image/png');
    } catch (e) {
        return null;
    }
}

// Miniatyr direkt från studions canvas (kan misslyckas via file:// –
// anroparen väljer då vilken fallback-bild som ska användas)
export function thumbnailFromCanvas(canvas, size) {
    if (!canvas) return null;
    const small = document.createElement('canvas');
    small.width = size;
    small.height = size;
    small.getContext('2d').drawImage(canvas, 0, 0, size, size);
    try {
        return small.toDataURL('image/png');
    } catch (e) {
        return null;
    }
}

export function studioPrintBox(W, H) {
    const w = STUDIO_PRINT_BOX.w * W;
    const h = STUDIO_PRINT_BOX.h * H;
    return { x: STUDIO_PRINT_BOX.cx * W - w / 2, y: STUDIO_PRINT_BOX.cy * H - h / 2, w, h };
}

function studioFontString(px, fontId) {
    // Bygg ut font-strings med explicit storlek (1em → px)
    return STUDIO_FONTS[fontId || 'serif'].replace('1em', px + 'px');
}

function studioWrapText(ctx, text, maxWidth, size, fontId) {
    ctx.font = studioFontString(size, fontId);
    const words = text.split(/\s+/).filter(Boolean);
    const lines = [];
    let current = '';
    for (const word of words) {
        const test = current ? current + ' ' + word : word;
        if (!current || ctx.measureText(test).width <= maxWidth) {
            current = test;
        } else {
            lines.push(current);
            current = word;
        }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [''];
}

function clipRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
}

// Rita muggen med färgton (source-atop bevarar skuggningarna)
function tintedMug(colorId) {
    const color = STUDIO_MUG_COLORS.find(c => c.id === colorId);
    if (!color || !color.tint) return mugImg;
    const off = document.createElement('canvas');
    off.width = mugImg.naturalWidth;
    off.height = mugImg.naturalHeight;
    const octx = off.getContext('2d');
    octx.drawImage(mugImg, 0, 0);
    octx.globalCompositeOperation = 'source-atop';
    octx.fillStyle = color.tint;
    octx.fillRect(0, 0, off.width, off.height);
    return off;
}

// Gemensam renderer för studions stora canvas (660px) och
// varukorgens mini-canvasar (76px). Textstorleken ska alltid vara
// angiven i 660px-skala – den skalas ner automatiskt.
export function drawMugDesign(canvas, design, options) {
    const opts = options || {};
    const placeholder = opts.placeholder !== false;
    const minSize = opts.minSize !== undefined ? opts.minSize : 14;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // 1) Muggen (med ev. färgton)
    if (mugImg.complete && mugImg.naturalWidth > 0) {
        ctx.drawImage(tintedMug(design.mugColorId), 0, 0, W, H);
    } else if (placeholder) {
        ctx.fillStyle = '#e7e1d5';
        clipRoundRect(ctx, W * 0.18, H * 0.2, W * 0.5, H * 0.7, 24);
        ctx.fill();
    }

    // 2) Designen, klippt inuti tryckyta
    const box = studioPrintBox(W, H);
    ctx.save();
    clipRoundRect(ctx, box.x, box.y, box.w, box.h, 14 * (W / 660));
    ctx.clip();

    const scale = W / 660;

    if (design.mode === 'text' && (design.text || '').trim()) {
        let size = Math.max(6 * scale, (design.fontSize || 44) * scale);
        let lines = studioWrapText(ctx, design.text, box.w * 0.92, size, design.font);

        // Krympa om texten inte ryms vertikalt
        const lineHeight = 1.18;
        while (lines.length > 1 && lines.length * size * lineHeight > box.h * 0.92 && size > minSize * scale) {
            size -= 2 * scale;
            lines = studioWrapText(ctx, design.text, box.w * 0.92, size, design.font);
        }

        ctx.fillStyle = design.textColor || '#181c19';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = studioFontString(size, design.font);
        const lineH = size * lineHeight;
        const startY = box.y + box.h / 2 - ((lines.length - 1) * lineH) / 2;
        lines.forEach((line, i) => {
            ctx.fillText(line, box.x + box.w / 2, startY + i * lineH);
        });
    } else if (design.mode === 'image' && design.image) {
        const img = getImage(design.image);
        if (img.complete && img.naturalWidth > 0) {
            const s = Math.min((box.w * 0.92) / img.naturalWidth, (box.h * 0.92) / img.naturalHeight);
            const w = img.naturalWidth * s;
            const h = img.naturalHeight * s;
            ctx.drawImage(img, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h);
        }
    }

    ctx.restore();
}

/* =========================================================
Designsnapshot – sparas på varukorgsraden så att förhandsvisningen
kan ritas direkt på canvas i varukorgen
========================================================= */

export function defaultStudioState() {
    return {
        mode: 'text',
        text: 'One more cup?',
        fontSize: 44,
        font: 'serif',
        textColor: '#181c19',
        mugColorId: 'white',
        uploadedDataURL: null,
        fileName: ''
    };
}

export function studioDesignSnapshot(s) {
    return {
        mode: s.mode,
        text: s.text,
        fontSize: s.fontSize,
        font: s.font,
        textColor: s.textColor,
        mugColorId: s.mugColorId,
        fileName: s.fileName,
        image: null
    };
}

export function studioDesignSummary(s) {
    if (s.mode === 'text') {
        return 'Personlig mugg – tryckt text: "' + (s.text || '').trim() + '"';
    }
    return 'Personlig mugg – tryckt egen bild' + (s.fileName ? ' (' + s.fileName + ')' : '');
}

// Unik nyckel för en design – samma design ger samma nyckel
export function studioDesignKey(s) {
    return [
        s.mode,
        s.text,
        s.fontSize,
        s.font,
        s.textColor,
        s.mugColorId,
        s.fileName
    ].join('|');
}

// Samma design -> samma id (samma rad i varukorgen),
// olika design -> eget id så varje mugg blir sin egen rad
export function studioDesignId(s) {
    const key = studioDesignKey(s);
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % 100000;
    }
    return STUDIO_CART_ID + hash;
}
