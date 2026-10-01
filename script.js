
const products = [
    {
        id: 1,
        name: "BrewCoff Clean White",
        category: "motiv",
        price: 89,
        desc: "Stilren vit porslinsmugg utan tryck.",
        image: "Images/Stock-Mugg.png"
    },
    {
        id: 2,
        name: "BrewCoff Classic Mugg",
        category: "motiv",
        price: 99,
        desc: "Klassisk vit porslinsmugg med den bruna BrewCoff-logotypen.",
        image: "Images/brewcoff-mugg.png"
    },
    {
        id: 3,
        name: "BrewCoff Duo-Tone Mugg",
        category: "motiv",
        price: 119,
        desc: "Tvåfärgad porslinsmugg med brun bas och BrewCoff-tryck.",
        image: "Images/brewcoff-mugg-half.png"
    },
    {
        id: 4,
        name: "BrewCoff Mugg, One More?",
        category: "motiv",
        price: 119,
        desc: "Klassisk brun porslinsmugg med vitt tryck.",
        image: "Images/brewcoff-mugg-onemore.png"
    },
    {
        id: 5,
        name: "BrewCoff Mugg, Fika",
        category: "motiv",
        price: 129,
        desc: "Klassisk brun porslinsmugg med vitt tryck och fika dekaler",
        image: "Images/brewcoff-mugg-fika.png"
    },
    {
        id: 6,
        name: "BrewCoff Mugg, Irish Coffee",
        category: "motiv",
        price: 129,
        desc: "Klassisk brun porslinsmugg med vitt, irish coffe tryck",
        image: "Images/brewcoff-mugg-irish.png"
    },
    {
        id: 7,
        name: "Kaffe Filter",
        category: "filter",
        price: 99,
        desc: "100st",
        image: "Images/coffe-filter.png"
    },
    {
        id: 8,
        name: "Kaffe Filter",
        category: "filter",
        price: 189,
        desc: "200st",
        image: "Images/coffe-filter.png"
    },
    {
        id: 9,
        name: "Kaffe Filter",
        category: "filter",
        price: 279,
        desc: "300st",
        image: "Images/coffe-filter.png"
    },
];

let cart = [];
let activeCategory = 'all';
let detailList = products;      // Produkten som visas i rutnätet just nu (används av pilarna)
let currentDetailId = null;     // Produkten som visas på detaljsidan just nu

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    if (typeof initCanvas === "function") initCanvas();
});

function renderProducts(items) {
    const container = document.getElementById("productContainer");
    container.innerHTML = "";
    detailList = items;

    items.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        // Gör så att man kommer till produktsidan när man trycker på kortet eller bilden
        card.innerHTML = `
            <span class="product-badge">${p.category === 'motiv' ? 'Mugg' : 'Filter'}</span>
            <div class="product-img-wrapper" onclick="openProductDetail(${p.id})">
                <img src="${p.image}" alt="${p.name}">
            </div>
            <h3 class="product-title" onclick="openProductDetail(${p.id})">${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
            <div class="product-bottom">
                <span class="product-price">${p.price} kr</span>
                <button class="add-cart-btn" onclick="addToCart(${p.id})">Lägg till</button>
            </div>
        `;
        container.appendChild(card);
    });
}

/* Navigering mellan vyer */
function openProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    currentDetailId = productId;

    // Position "x av y" + dölj pilarna om det bara är en produkt i listan
    const idx = detailList.findIndex(p => p.id === productId);
    document.getElementById("detailPosition").innerText =
        (idx >= 0 ? idx + 1 : "–") + " av " + detailList.length;
    const showNav = detailList.length > 1;
    document.querySelectorAll(".detail-nav").forEach(b => b.style.display = showNav ? "flex" : "none");

    document.getElementById("detailImg").src = product.image;
    document.getElementById("detailImg").alt = product.name;
    document.getElementById("detailBadge").innerText = product.category === 'motiv' ? 'Mugg' : 'Filter';
    document.getElementById("detailTitle").innerText = product.name;
    document.getElementById("detailPrice").innerText = `${product.price} kr`;
    document.getElementById("detailDesc").innerText = product.desc;

    // Koppla "Lägg till"-knappen på produktsidan
    const addBtn = document.getElementById("detailAddToCartBtn");
    addBtn.onclick = function() {
        addToCart(product.id);
    };

    // Visa produktsidan, dölj huvudvyn
    document.getElementById("mainView").style.display = "none";
    document.getElementById("productDetailView").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showMainView() {
    document.getElementById("productDetailView").style.display = "none";
    document.getElementById("mainView").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hoppar till föregående/nästa produkt (går runt i listan)
function navigateProduct(delta) {
    if (detailList.length <= 1) return;
    const idx = detailList.findIndex(p => p.id === currentDetailId);
    const next = detailList[(idx + delta + detailList.length) % detailList.length];
    openProductDetail(next.id);
}

// Piltangenter på produktsidan
document.addEventListener('keydown', (e) => {
    const view = document.getElementById("productDetailView");
    if (!view || view.style.display === "none") return;
    if (e.key === "ArrowLeft") navigateProduct(-1);
    if (e.key === "ArrowRight") navigateProduct(1);
});

function filterCategory(cat, btn) {
    activeCategory = cat;
    if(btn) {
        document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    if(cat === 'all') {
        renderProducts(products);
    } else {
        renderProducts(products.filter(p => p.category === cat));
    }
}

function searchProducts(query) {
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.desc.toLowerCase().includes(query.toLowerCase())
    );
    renderProducts(filtered);
}
function scrollToSection(id) {
const mainView = document.getElementById("mainView");
if (mainView.style.display === "none") {
mainView.style.display = "block";
document.getElementById("productDetailView").style.display = "none";
}
setTimeout(() => {
document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}, 30);
}

// Scrollar till toppen av sidan (används av loggan)
function scrollToTop() {
const mainView = document.getElementById("mainView");
if (mainView.style.display === "none") {
mainView.style.display = "block";
document.getElementById("productDetailView").style.display = "none";
}
window.scrollTo({ top: 0, behavior: "smooth" });
}

// Ger navbaren en skugga när man scrollat ner
window.addEventListener("scroll", () => {
document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 10);
});

/* =========================================================
BrewCoff Studio – Custom Mugg Maker (Jakob)

Anropas av initCanvas() i DOMContentLoaded högre upp.
Namn är prefixade med studio för att undvika kollisioner.
========================================================= */

const STUDIO_PRICE = 149;

const studioState = {
mode: 'text',            // 'text' | 'image'
text: 'One more cup?',
fontSize: 44,            // i canvas-px (canvas är 660x660)
font: 'serif',           // 'serif' | 'serif-italic' | 'sans'
textColor: '#181c19',
mugColorId: 'white',
uploadedImage: null,     // HTMLImageElement
fileName: ''
};

const STUDIO_MUG_IMG = new Image();

const STUDIO_MUG_COLORS = [
{ id: 'white',  label: 'Vit',         hex: '#ffffff', tint: null },
{ id: 'brown',  label: 'Kaffebrun',   hex: '#7c5433', tint: 'rgba(124, 84, 51, 0.60)' },
{ id: 'beige',  label: 'Beige',       hex: '#d9c1a3', tint: 'rgba(217, 193, 163, 0.55)' },
{ id: 'gray',   label: 'Grå',         hex: '#a8adb3', tint: 'rgba(168, 173, 179, 0.55)' },
{ id: 'blue',   label: 'Blå',         hex: '#7d9bb8', tint: 'rgba(125, 155, 184, 0.55)' },
{ id: 'red',    label: 'Terrakotta',  hex: '#b06a5e', tint: 'rgba(176, 106, 94, 0.50)' }
];

const STUDIO_TEXT_COLORS = [
{ id: 'black', label: 'Svart',    hex: '#181c19' },
{ id: 'white', label: 'Vit',      hex: '#ffffff' },
{ id: 'brown', label: 'Mörkbrun', hex: '#3b2720' },
{ id: 'amber', label: 'Amber',    hex: '#d97706' }
];

const STUDIO_FONTS = {
serif:        '700 1em "Playfair Display", Georgia, serif',
'serif-italic': 'italic 700 1em "Playfair Display", Georgia, serif',
sans:         '700 1em "Plus Jakarta Sans", sans-serif'
};

// Tryckyta på muggen, relativt mot muggbilden (mät i Stock-Mugg.png):
// kroppen sträcker sig ca x 14-70% (handtaget ligger till höger om det),
// vertikalt ca 12-90%. Tryckytan undviker kanten och handtaget.
const STUDIO_PRINT_BOX = { cx: 0.42, cy: 0.535, w: 0.36, h: 0.48 };

let studioStatusTimer = null;

/* ------------------------------------------------------------
Init – anropas av DOMContentLoaded högre upp i filen
------------------------------------------------------------ */

function initCanvas() {
STUDIO_MUG_IMG.onload = () => studioRender();
STUDIO_MUG_IMG.onerror = () => studioRender(); // placeholder istället
STUDIO_MUG_IMG.src = 'Images/Stock-Mugg.png';

studioBuildMugSwatches();
studioBuildTextSwatches();
studioSyncInputs();

// Rita direkt (fallback-font), sen igen när webfonts är klara
studioRender();
if (document.fonts && document.fonts.load) {
Promise.all([
    document.fonts.load('700 48px "Playfair Display"'),
    document.fonts.load('italic 700 48px "Playfair Display"'),
    document.fonts.load('700 48px "Plus Jakarta Sans"')
]).then(() => studioRender()).catch(() => {});
}
}

/* ------------------------------------------------------------
Rendering
------------------------------------------------------------ */

function studioPrintBox(W, H) {
const w = STUDIO_PRINT_BOX.w * W;
const h = STUDIO_PRINT_BOX.h * H;
return { x: STUDIO_PRINT_BOX.cx * W - w / 2, y: STUDIO_PRINT_BOX.cy * H - h / 2, w, h };
}

function studioRender() {
const canvas = document.getElementById('studioCanvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

ctx.clearRect(0, 0, W, H);

// 1) Muggen (med ev. färgton)
if (STUDIO_MUG_IMG.complete && STUDIO_MUG_IMG.naturalWidth > 0) {
ctx.drawImage(studioTintedMug(), 0, 0, W, H);
} else {
studioDrawPlaceholder(ctx, W, H);
}

// 2) Designen, klippt inuti tryckyta
const box = studioPrintBox(W, H);
ctx.save();
studioClipRoundRect(ctx, box.x, box.y, box.w, box.h, 14);
ctx.clip();

if (studioState.mode === 'text') {
studioDrawText(ctx, box);
} else if (studioState.uploadedImage) {
studioDrawImage(ctx, box);
}

ctx.restore();
}

function studioTintedMug() {
const color = STUDIO_MUG_COLORS.find(c => c.id === studioState.mugColorId);
if (!color || !color.tint) return STUDIO_MUG_IMG;

// Offscreen: rita muggen och lägg färgtonen bara ovanpå opake
// pixlar (source-atop) så skuggningarna bevaras.
const off = document.createElement('canvas');
off.width = STUDIO_MUG_IMG.naturalWidth;
off.height = STUDIO_MUG_IMG.naturalHeight;
const octx = off.getContext('2d');
octx.drawImage(STUDIO_MUG_IMG, 0, 0);
octx.globalCompositeOperation = 'source-atop';
octx.fillStyle = color.tint;
octx.fillRect(0, 0, off.width, off.height);
return off;
}

function studioDrawPlaceholder(ctx, W, H) {
ctx.fillStyle = '#e7e1d5';
ctx.beginPath();
const x = W * 0.18, y = H * 0.2, w = W * 0.5, h = H * 0.7;
if (ctx.roundRect) ctx.roundRect(x, y, w, h, 24);
else ctx.rect(x, y, w, h);
ctx.fill();
}

function studioClipRoundRect(ctx, x, y, w, h, r) {
ctx.beginPath();
if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
else ctx.rect(x, y, w, h);
}

function studioFontString(px) {
// Bygg ut font-strings med explicit storlek (1em → px)
return STUDIO_FONTS[studioState.font].replace('1em', px + 'px');
}

function studioDrawText(ctx, box) {
const text = (studioState.text || '').trim();
if (!text) return;

ctx.fillStyle = studioState.textColor;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

let size = studioState.fontSize;
let lines = studioWrapText(ctx, text, box.w * 0.92, size);

// Krympa om texten inte ryms vertikalt
const lineHeight = 1.18;
while (lines.length > 1 && lines.length * size * lineHeight > box.h * 0.92 && size > 14) {
size -= 2;
lines = studioWrapText(ctx, text, box.w * 0.92, size);
}

ctx.font = studioFontString(size);
const lineH = size * lineHeight;
const startY = box.y + box.h / 2 - ((lines.length - 1) * lineH) / 2;

lines.forEach((line, i) => {
ctx.fillText(line, box.x + box.w / 2, startY + i * lineH);
});
}

function studioWrapText(ctx, text, maxWidth, size) {
ctx.font = studioFontString(size);
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

function studioDrawImage(ctx, box) {
const img = studioState.uploadedImage;
const scale = Math.min((box.w * 0.92) / img.naturalWidth, (box.h * 0.92) / img.naturalHeight);
const w = img.naturalWidth * scale;
const h = img.naturalHeight * scale;
ctx.drawImage(img, box.x + (box.w - w) / 2, box.y + (box.h - h) / 2, w, h);
}

/* ------------------------------------------------------------
Kontroller
------------------------------------------------------------ */

function studioSetMode(mode) {
studioState.mode = mode;
document.querySelectorAll('#studio .studio-seg-btn').forEach(btn => {
btn.classList.toggle('active', btn.dataset.mode === mode);
});
document.getElementById('studioTextPanel').classList.toggle('hidden', mode !== 'text');
document.getElementById('studioImagePanel').classList.toggle('hidden', mode !== 'image');
document.getElementById('studioTextColorField').classList.toggle('hidden', mode !== 'text');
studioRender();
}

function studioOnTextInput() {
studioState.text = document.getElementById('studioText').value;
const counter = document.getElementById('studioCounter');
if (counter) counter.textContent = studioState.text.length + '/32';
studioRender();
}

function studioOnFontResize() {
const value = parseInt(document.getElementById('studioFontSize').value, 10);
if (!isNaN(value)) studioState.fontSize = value;
studioRender();
}

function studioOnFontChange() {
const font = document.getElementById('studioFont').value;
if (STUDIO_FONTS[font]) studioState.font = font;
studioRender();
}

function studioOnFile(input) {
const file = input.files && input.files[0];
if (!file) return;

const reader = new FileReader();
reader.onload = e => {
const img = new Image();
img.onload = () => {
    studioState.uploadedImage = img;
    studioState.fileName = file.name;
    const label = document.getElementById('studioFileName');
    if (label) label.textContent = file.name;
    studioRender();
};
img.src = e.target.result;
};
reader.readAsDataURL(file);
}

function studioSelectMugColor(id) {
studioState.mugColorId = id;
document.querySelectorAll('#studioMugSwatches .studio-swatch').forEach(el => {
el.classList.toggle('active', el.dataset.colorId === id);
});
studioRender();
}

function studioSelectTextColor(id, hex) {
studioState.textColor = hex;
document.querySelectorAll('#studioTextSwatches .studio-swatch').forEach(el => {
el.classList.toggle('active', el.dataset.colorId === id);
});
studioRender();
}

function studioOnCustomColor(value) {
studioState.textColor = value;
document.querySelectorAll('#studioTextSwatches .studio-swatch').forEach(el => {
el.classList.remove('active');
});
studioRender();
}

function studioBuildMugSwatches() {
const wrap = document.getElementById('studioMugSwatches');
if (!wrap) return;
STUDIO_MUG_COLORS.forEach(color => {
const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'studio-swatch' + (color.id === studioState.mugColorId ? ' active' : '');
btn.style.background = color.hex;
btn.dataset.colorId = color.id;
btn.title = color.label;
btn.setAttribute('aria-label', 'Muggfärg ' + color.label);
btn.onclick = () => studioSelectMugColor(color.id);
wrap.appendChild(btn);
});
}

function studioBuildTextSwatches() {
const wrap = document.getElementById('studioTextSwatches');
if (!wrap) return;
STUDIO_TEXT_COLORS.forEach(color => {
const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'studio-swatch' + (color.id === 'black' ? ' active' : '');
btn.style.background = color.hex;
btn.dataset.colorId = color.id;
btn.title = color.label;
btn.setAttribute('aria-label', 'Tryckfärg ' + color.label);
btn.onclick = () => studioSelectTextColor(color.id, color.hex);
wrap.appendChild(btn);
});
}

function studioSyncInputs() {
const text = document.getElementById('studioText');
if (text) text.value = studioState.text;
const counter = document.getElementById('studioCounter');
if (counter) counter.textContent = studioState.text.length + '/32';
const size = document.getElementById('studioFontSize');
if (size) size.value = studioState.fontSize;
const font = document.getElementById('studioFont');
if (font) font.value = studioState.font;
}

function studioReset() {
studioState.text = 'One more cup?';
studioState.fontSize = 44;
studioState.font = 'serif';
studioState.textColor = '#181c19';
studioState.mugColorId = 'white';
studioState.uploadedImage = null;
studioState.fileName = '';

const file = document.getElementById('studioFile');
if (file) file.value = '';
const name = document.getElementById('studioFileName');
if (name) name.textContent = '';
const custom = document.getElementById('studioCustomColor');
if (custom) custom.value = '#181c19';

studioSyncInputs();
studioSetMode('text');
studioSelectMugColor('white');
studioSelectTextColor('black', '#181c19');
studioStatus('Designen är återställd.');
}

/* ------------------------------------------------------------
Åtgärder: varukorg & ladda ner
------------------------------------------------------------ */

function studioDesignSummary() {
if (studioState.mode === 'text') {
return 'Personlig mugg – tryckt text: "' + (studioState.text || '').trim() + '"';
}
return 'Personlig mugg – tryckt egen bild' + (studioState.fileName ? ' (' + studioState.fileName + ')' : '');
}

function studioThumbnailDataURL(size) {
const canvas = document.getElementById('studioCanvas');
const small = document.createElement('canvas');
small.width = size;
small.height = size;
small.getContext('2d').drawImage(canvas, 0, 0, size, size);
try {
    return small.toDataURL('image/png');
} catch (e) {
    // "Tainted canvas" t.ex. om sidan öppnas via file:// –
    // falla tillbaka på standardmuggen så muggen ändå hamnar i varukorgen
    return 'Images/Stock-Mugg.png';
}
}

const STUDIO_CART_ID = 9901; // Grund-id: studio-muggar får id 9901 + hash av designen
// (numeriskt id krävs eftersom varukorgens changeQty/removeFromCart
// ritar item.id in i inline onclick-handlarna)

function studioDesignKey() {
    // Unik nyckel för nuvarande design - samma design ger samma nyckel
    return [
        studioState.mode,
        studioState.text,
        studioState.fontSize,
        studioState.font,
        studioState.textColor,
        studioState.mugColorId,
        studioState.fileName
    ].join('|');
}

function studioDesignId() {
    // Samma design -> samma id (samma rad i varukorgen),
    // olika design -> eget id så varje mugg blir sin egen rad
    const key = studioDesignKey();
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) % 100000;
    }
    return STUDIO_CART_ID + hash;
}

function studioAddToCart() {
// Varukorgsarrayen (let högre upp i filen) delas i samma scope,
// så vi pushar ett produkt-liknande objekt direkt.
let added = false;
try {
if (typeof cart !== 'undefined' && Array.isArray(cart)) {
    const id = studioDesignId();
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
        existing.desc = studioDesignSummary();
        existing.image = studioThumbnailDataURL(220);
    } else {
        cart.push({
            id: id,
            name: 'BrewCoff Custom Mugg',
            category: 'motiv',
            price: STUDIO_PRICE,
            desc: studioDesignSummary(),
            image: studioThumbnailDataURL(220),
            qty: 1
        });
    }
    added = true;
    // Uppdatera varukorgsvyn och lagring (funktioner från varukorgsskriptet)
    if (typeof saveCartToStorage === 'function') saveCartToStorage();
    if (typeof renderCart === 'function') renderCart();
}
} catch (e) {
// Varukorgen är inte tillgänglig - ignorera.
}

if (added) {
if (typeof showToast === 'function') showToast('Din custom mugg lades i varukorgen');
else studioStatus('✓ Din mugg ligger i varukorgen!');
} else {
studioStatus('Varukorgen är inte klar ännu - försök igen.', true);
}
}
function studioStatus(msg, isError) {
const el = document.getElementById('studioStatus');
if (!el) return;
el.textContent = msg;
el.className = 'studio-status' + (isError ? ' error' : '');
if (studioStatusTimer) clearTimeout(studioStatusTimer);
if (msg) {
studioStatusTimer = setTimeout(() => {
    el.textContent = '';
    el.className = 'studio-status';
}, 4000);
}
}

/* ===== Footer (Anton Blad) – klickar rätt filterpill ===== */
function goToCategory(pillText) {
    const pill = [...document.querySelectorAll('.filter-pill')]
      .find(p => p.textContent.trim() === pillText);
    if (pill) pill.click();
}

/* =========================================================
Varukorg (Anton Gren)
========================================================= */

const FREE_SHIPPING_LIMIT = 299; // Fri frakt över 299 kr (enligt toppbaren)
const SHIPPING_COST = 49;
const CART_STORAGE_KEY = 'brewcoff_cart';
let cartToastTimer = null;

// ===== Lagring (localStorage) =====
function saveCartToStorage() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) { /* localStorage inte tillgängligt */ }
}

function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (!Array.isArray(saved)) return;
        cart.length = 0;
        saved.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product && item.qty > 0) {
                cart.push({
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    desc: product.desc,
                    image: product.image,
                    qty: item.qty
                });
            } else if (item.id >= STUDIO_CART_ID && item.qty > 0) {
                // Custom mugg från studio saknas i products – namn, pris,
                // beskrivning och miniatyrbild sparas därför på item själv
                cart.push({
                    id: item.id,
                    name: item.name || 'BrewCoff Custom Mugg',
                    category: 'motiv',
                    price: item.price || STUDIO_PRICE,
                    desc: item.desc,
                    image: item.image || 'Images/Stock-Mugg.png',
                    qty: item.qty
                });
            }
        });
    } catch (e) { /* trasig sparad varukorg -> ignorera */ }
}

// ===== Lägg till / ändra / ta bort =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            desc: product.desc,
            image: product.image,
            qty: 1
        });
    }
    saveCartToStorage();
    renderCart();
    showToast(product.name + " lades i varukorgen");
}

function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(productId);
    } else {
        saveCartToStorage();
        renderCart();
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(i => i.id === productId);
    if (index === -1) return;
    cart.splice(index, 1);
    saveCartToStorage();
    renderCart();
}

// ===== Beräkningar =====
function cartSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartTotalQty() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
}

function shippingCost() {
    if (cart.length === 0) return 0;
    return cartSubtotal() >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_COST;
}

function formatKr(amount) {
    return amount.toLocaleString('sv-SE') + ' kr';
}

// ===== Rendering =====
function renderCart() {
    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const countEl = document.getElementById('cartCount');
    if (!itemsEl) return;

    // Antal-badge på varukorgsknappen
    const totalQty = cartTotalQty();
    if (countEl) {
        countEl.textContent = totalQty;
        countEl.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    // Tom varukorg
    if (cart.length === 0) {
        itemsEl.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">☕</div>
                <p>Din varukorg är tom.</p>
                <button class="cart-continue-btn" onclick="toggleCart()">Fortsätt handla</button>
            </div>`;
        footerEl.style.display = 'none';
        return;
    }

    footerEl.style.display = 'block';

    itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${item.name}</h4>
                ${item.desc ? `<p class="cart-item-desc">${item.desc}</p>` : ''}
                <p class="cart-item-price">${formatKr(item.price)} / st</p>
                <div class="cart-item-actions">
                    <div class="qty-stepper">
                        <button onclick="changeQty(${item.id}, -1)" aria-label="Minska antal">&minus;</button>
                        <span class="qty-value">${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)" aria-label="Öka antal">+</button>
                    </div>
                    <button class="cart-remove-btn" onclick="removeFromCart(${item.id})">Ta bort</button>
                </div>
            </div>
            <span class="cart-item-line-total">${formatKr(item.price * item.qty)}</span>
        </div>
    `).join('');

    // Totaler
    const subtotal = cartSubtotal();
    const shipping = shippingCost();
    document.getElementById('cartSubtotal').textContent = formatKr(subtotal);

    const shippingEl = document.getElementById('cartShipping');
    shippingEl.textContent = shipping === 0 ? 'Fri frakt' : formatKr(shipping);
    shippingEl.classList.toggle('free', shipping === 0);

    document.getElementById('cartTotal').textContent = formatKr(subtotal + shipping);

    // Frakt-progress
    const noteEl = document.getElementById('shippingNote');
    const barEl = document.getElementById('shippingProgress');
    if (subtotal >= FREE_SHIPPING_LIMIT) {
        noteEl.textContent = 'Du har kvalificerat dig för fri frakt!';
        barEl.style.width = '100%';
    } else {
        noteEl.textContent = 'Köp för ' + formatKr(FREE_SHIPPING_LIMIT - subtotal) + ' till för fri frakt';
        barEl.style.width = Math.min(100, (subtotal / FREE_SHIPPING_LIMIT) * 100) + '%';
    }
}

// ===== Öppna / stäng =====
function toggleCart(forceOpen) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer || !overlay) return;
    const willOpen = typeof forceOpen === 'boolean' ? forceOpen : !drawer.classList.contains('open');
    drawer.classList.toggle('open', willOpen);
    overlay.classList.toggle('open', willOpen);
    document.body.style.overflow = willOpen ? 'hidden' : '';
}

// Stäng med Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const drawer = document.getElementById('cartDrawer');
        if (drawer && drawer.classList.contains('open')) toggleCart(false);
    }
});

// ===== Kassa (demo) =====
function checkout() {
    if (cart.length === 0) return;
    const total = cartSubtotal() + shippingCost();
    alert('Tack för din beställning!\n\nTotalt: ' + formatKr(total) +
        '\n\n(Detta är en demo – ingen betalning görs.)');
    cart.length = 0;
    saveCartToStorage();
    renderCart();
    toggleCart(false);
}

// ===== Toast-notis =====
function showToast(message) {
    let toast = document.getElementById('cartToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cartToast';
        toast.className = 'cart-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(cartToastTimer);
    cartToastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ===== Init =====
loadCartFromStorage();
renderCart();

// ===== Menyknapp & sidmeny (Rasmus) =====
(function () {
    const menuBtn = document.getElementById('menuBtn');
    const overlay = document.getElementById('menuOverlay');
    const sidebar = document.getElementById('menuSidebar');
    const closeBtn = document.getElementById('menuClose');
    if (!menuBtn || !overlay || !sidebar || !closeBtn) return;

    function setMenu(open) {
        overlay.classList.toggle('open', open);
        sidebar.classList.toggle('open', open);
        document.body.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    menuBtn.addEventListener('click', () => {
        setMenu(!sidebar.classList.contains('open'));
    });

    closeBtn.addEventListener('click', () => setMenu(false));
    overlay.addEventListener('click', () => setMenu(false));

    // Ljust/mörkt läge – byt tema och spara valet i localStorage
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const root = document.documentElement;
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('brewcoff-theme', next);
        });
    }

    // "Kontakta oss" & "Hjälp & support" – skrolla till footern och stäng menyn
    document.querySelectorAll('.sidebar-item[data-goto]').forEach((item) => {
        item.addEventListener('click', () => {
            setMenu(false);
            const target =
                item.dataset.goto === 'footer'
                    ? document.querySelector('.site-footer')
                    : document.getElementById(item.dataset.goto);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Stäng sidmenyn med Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });
})();
