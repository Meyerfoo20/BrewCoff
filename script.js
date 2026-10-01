
const products = [
    {
        id: 1,
        name: "BrewCoff Clean White",
        nameEn: "BrewCoff Clean White",
        category: "motiv",
        price: 89,
        desc: "Stilren vit porslinsmugg utan tryck.",
        descEn: "A clean white porcelain mug with no print.",
        image: "Images/Stock-Mugg.png"
    },
    {
        id: 2,
        name: "BrewCoff Classic Mugg",
        nameEn: "BrewCoff Classic Mug",
        category: "motiv",
        price: 99,
        desc: "Klassisk vit porslinsmugg med den bruna BrewCoff-logotypen.",
        descEn: "A classic white porcelain mug with the brown BrewCoff logo.",
        image: "Images/brewcoff-mugg.png"
    },
    {
        id: 3,
        name: "BrewCoff Duo-Tone Mugg",
        nameEn: "BrewCoff Duo-Tone Mug",
        category: "motiv",
        price: 119,
        desc: "Tvåfärgad porslinsmugg med brun bas och BrewCoff-tryck.",
        descEn: "Two-tone porcelain mug with a brown base and BrewCoff print.",
        image: "Images/brewcoff-mugg-half.png"
    },
    {
        id: 4,
        name: "BrewCoff Mugg, One More?",
        nameEn: "BrewCoff Mug, One More?",
        category: "motiv",
        price: 119,
        desc: "Klassisk brun porslinsmugg med vitt tryck.",
        descEn: "A classic brown porcelain mug with white print.",
        image: "Images/brewcoff-mugg-onemore.png"
    },
    {
        id: 5,
        name: "BrewCoff Mugg, Fika",
        nameEn: "BrewCoff Mug, Fika",
        category: "motiv",
        price: 129,
        desc: "Klassisk brun porslinsmugg med vitt tryck och fika dekaler",
        descEn: "A classic brown porcelain mug with white print and fika decals",
        image: "Images/brewcoff-mugg-fika.png"
    },
    {
        id: 6,
        name: "BrewCoff Mugg, Irish Coffee",
        nameEn: "BrewCoff Mug, Irish Coffee",
        category: "motiv",
        price: 129,
        desc: "Klassisk brun porslinsmugg med vitt, irish coffe tryck",
        descEn: "A classic brown porcelain mug with a white Irish coffee print",
        image: "Images/brewcoff-mugg-irish.png"
    },
    {
        id: 7,
        name: "Kaffe Filter",
        nameEn: "Coffee Filters",
        category: "filter",
        price: 99,
        desc: "100st",
        descEn: "100 pcs",
        image: "Images/coffe-filter.png"
    },
    {
        id: 8,
        name: "Kaffe Filter",
        nameEn: "Coffee Filters",
        category: "filter",
        price: 189,
        desc: "200st",
        descEn: "200 pcs",
        image: "Images/coffe-filter.png"
    },
    {
        id: 9,
        name: "Kaffe Filter",
        nameEn: "Coffee Filters",
        category: "filter",
        price: 279,
        desc: "300st",
        descEn: "300 pcs",
        image: "Images/coffe-filter.png"
    },
];

let cart = [];
let activeCategory = 'all';
let detailList = products;      // Produkten som visas i rutnätet just nu (används av pilarna)
let currentDetailId = null;     // Produkten som visas på detaljsidan just nu

// ===== Språk (Svenska/Engelska) =====
const LANG_KEY = 'brewcoff-lang';
let currentLang = 'sv';
try {
    const savedLang = localStorage.getItem(LANG_KEY);
    if (savedLang === 'sv' || savedLang === 'en') currentLang = savedLang;
} catch (e) { /* localStorage tillgängligt ej */ }

const I18N = {
    sv: {
        topbar: 'Snabb leverans 1-3 vardagar',
        navProducts: 'Produkter',
        navCustom: 'Custom mugg',
        navAbout: 'Om oss',
        openMenu: 'Öppna meny',
        closeMenu: 'Stäng meny',
        menuTitle: 'Meny',
        login: 'Logga in',
        theme: 'Ljust/mörkt läge',
        language: 'Språk',
        contact: 'Kontakta oss',
        help: 'Hjälp & support',
        logout: 'Logga ut',
        closeLogin: 'Stäng inloggning',
        email: 'E-post',
        emailPlaceholder: 'din@epost.se',
        password: 'Lösenord',
        loginError: 'Ange en giltig e-post och ett lösenord',
        heroBadge: 'Hantverksmuggar & kaffefilter',
        heroTitle: 'Ditt kaffe förtjänar en mugg med personlighet',
        heroSubtitle: 'Hos BrewCoff designar vi porslinsmuggar och kaffefilter som gör vardagliga fikastunder lite finare. Enkel design, tåliga material och tryck som håller – disk för disk.',
        heroCta: 'Se alla produkter',
        heroCta2: 'Läs om oss',
        all: 'Alla',
        mugs: 'Muggar',
        filters: 'Kaffefilter',
        searchPlaceholder: 'Sök mugg eller filter...',
        studioEyebrow: 'BrewCoff Studio',
        studioTitle: 'Tillverka din egen mugg',
        studioDesc: 'Skriv din egen text eller ladda upp en bild – vi trycker den på en klassiska BrewCoff-porslinsmugg i färgen du vill.',
        studioPreview: 'Förhandsvisning',
        studioStep1: '1. Välj design',
        studioTextMode: 'Text',
        studioImageMode: 'Egen bild',
        studioTextPlaceholder: 'Skriv din text, t.ex. Världens bästa mamma',
        studioSize: 'Storlek',
        fontSerif: 'Elegant serif',
        fontItalic: 'Kursiv serif',
        fontSans: 'Modern sans',
        studioUpload: 'Ladda upp en bild (PNG eller JPG)',
        studioUploadNote: 'Skärpast: logotyper och icikoner med tydlig kontur',
        studioStep2: '2. Muggfärg',
        studioStep3: '3. Tryckfärg',
        studioCustomColor: 'Egen färg',
        studioPrintIncluded: 'inkl. tryck',
        addToCart: 'Lägg till i varukorg',
        studioReset: 'Återställ design',
        studioFineprint: 'Leveranstid för personliga muggar: 5–7 dagar. Förhandsvisningen är en guide – det slutliga trycket kan variera något.',
        aboutTitle: 'Kaffe med hjärta, muggar med karaktär',
        aboutText: 'BrewCoff startade med en enkel idé: att fika ska vara en liten stund för dig själv. Vi designar våra muggar i små serier och lägger stor vikt vid både materialkvalitet och hållbarhet, så att din mugg håller i många kaffebryggor.',
        aboutCard1Title: 'Hantverkskvalitet',
        aboutCard1Text: 'Våra muggar formas i tålig porslin och kontrolleras för hand innan de skickas vidare till dig.',
        aboutCard2Title: 'Omsorg om miljön',
        aboutCard2Text: 'Vi packar i papper, inte plast, och väljer material som håller i många år – inte bara en säsong.',
        aboutCard3Title: 'Snabb leverans',
        aboutCard3Text: 'Vi skickar din order inom 1–3 vardagar, och frakten är gratis vid köp över 299 kr.',
        backToProducts: '← Tillbaka till produkter',
        prevProduct: 'Föregående produkt',
        nextProduct: 'Nästa produkt',
        cart: 'Varukorg',
        closeCart: 'Stäng varukorgen',
        openCart: 'Öppna varukorgen',
        freeShipping: '☕ Fri frakt vid beställningar över 299 kr',
        subtotal: 'Subtotal',
        shipping: 'Frakt',
        total: 'Totalt',
        checkout: 'Till kassan',
        footerTagline: 'Brinner för härliga koppar kaffe och seriösa kaffefilter för dig som tar kaffe på allvar',
        footerShop: 'Handla',
        footerCustom: 'Egen Design',
        footerService: 'Kundservice',
        footerShipping: 'Frakt & leverans',
        footerReturns: 'Returer och Reklamation',
        footerTerms: 'Köpvillkor',
        footerAddress: 'Helsingborg, Sverige',
        footerCopyright: '© 2025 BrewCoff. Alla rättigheter förbehållna. Bryggat med omsorg.',
        footerPrivacy: 'Sekretesspolicy',
        footerTermsShort: 'Villkor',
        mug: 'Mugg',
        filter: 'Filter',
        addShort: 'Lägg till',
        of: 'av',
        cartEmpty: 'Din varukorg är tom.',
        continueShopping: 'Fortsätt handla',
        perPiece: ' / st',
        decreaseQty: 'Minska antal',
        increaseQty: 'Öka antal',
        remove: 'Ta bort',
        freeShippingLabel: 'Fri frakt',
        qualifyNote: 'Du har kvalificerat dig för fri frakt!',
        moreForFreePrefix: 'Köp för ',
        moreForFreeSuffix: ' till för fri frakt',
        addedToCart: ' lades i varukorgen',
        customMugAdded: 'Din custom mugg lades i varukorgen',
        cartNotReady: 'Varukorgen är inte klar ännu - försök igen.',
        studioResetDone: 'Designen är återställd.',
        summaryTextPrefix: 'Personlig mugg – tryckt text: "',
        summaryImagePrefix: 'Personlig mugg – tryckt egen bild',
        checkoutThanks: 'Tack för din beställning!\n\nTotalt: ',
        checkoutDemo: '\n\n(Detta är en demo – ingen betalning görs.)',
        welcomePrefix: 'Välkommen, ',
        loggedOut: 'Du har loggat ut',
        mugColorAria: 'Muggfärg ',
        printColorAria: 'Tryckfärg '
    },
    en: {
        topbar: 'Fast delivery 1-3 business days',
        navProducts: 'Products',
        navCustom: 'Custom mug',
        navAbout: 'About us',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        menuTitle: 'Menu',
        login: 'Log in',
        theme: 'Light/dark mode',
        language: 'Language',
        contact: 'Contact us',
        help: 'Help & support',
        logout: 'Log out',
        closeLogin: 'Close login',
        email: 'Email',
        emailPlaceholder: 'you@email.com',
        password: 'Password',
        loginError: 'Please enter a valid email and a password',
        heroBadge: 'Handcrafted mugs & coffee filters',
        heroTitle: 'Your coffee deserves a mug with personality',
        heroSubtitle: 'At BrewCoff we design porcelain mugs and coffee filters that make everyday coffee breaks a little nicer. Simple design, durable materials and prints that last – wash after wash.',
        heroCta: 'See all products',
        heroCta2: 'Read about us',
        all: 'All',
        mugs: 'Mugs',
        filters: 'Coffee filters',
        searchPlaceholder: 'Search for mugs or filters...',
        studioEyebrow: 'BrewCoff Studio',
        studioTitle: 'Create your own mug',
        studioDesc: 'Write your own text or upload an image – we print it on a classic BrewCoff porcelain mug in the color you want.',
        studioPreview: 'Preview',
        studioStep1: '1. Choose design',
        studioTextMode: 'Text',
        studioImageMode: 'Your image',
        studioTextPlaceholder: 'Write your text, e.g. World\'s best mom',
        studioSize: 'Size',
        fontSerif: 'Elegant serif',
        fontItalic: 'Italic serif',
        fontSans: 'Modern sans',
        studioUpload: 'Upload an image (PNG or JPG)',
        studioUploadNote: 'Works best: logos and icons with clear outlines',
        studioStep2: '2. Mug color',
        studioStep3: '3. Print color',
        studioCustomColor: 'Custom color',
        studioPrintIncluded: 'incl. printing',
        addToCart: 'Add to cart',
        studioReset: 'Reset design',
        studioFineprint: 'Delivery time for personalized mugs: 5-7 days. The preview is a guide – the final print may vary slightly.',
        aboutTitle: 'Coffee with heart, mugs with character',
        aboutText: 'BrewCoff started with a simple idea: that fika should be a little moment for yourself. We design our mugs in small batches and put great weight on both material quality and sustainability, so that your mug lasts for many brews.',
        aboutCard1Title: 'Craftsmanship',
        aboutCard1Text: 'Our mugs are shaped in durable porcelain and hand-checked before they are sent on to you.',
        aboutCard2Title: 'Care for the environment',
        aboutCard2Text: 'We pack in paper, not plastic, and choose materials that last for many years – not just one season.',
        aboutCard3Title: 'Fast delivery',
        aboutCard3Text: 'We ship your order within 1-3 business days, and shipping is free on purchases over 299 kr.',
        backToProducts: '← Back to products',
        prevProduct: 'Previous product',
        nextProduct: 'Next product',
        cart: 'Cart',
        closeCart: 'Close cart',
        openCart: 'Open cart',
        freeShipping: '☕ Free shipping on orders over 299 kr',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        total: 'Total',
        checkout: 'To checkout',
        footerTagline: 'Passionate about lovely cups of coffee and serious coffee filters for those who take coffee seriously',
        footerShop: 'Shop',
        footerCustom: 'Custom Design',
        footerService: 'Customer service',
        footerShipping: 'Shipping & delivery',
        footerReturns: 'Returns and complaints',
        footerTerms: 'Terms of purchase',
        footerAddress: 'Helsingborg, Sweden',
        footerCopyright: '© 2025 BrewCoff. All rights reserved. Brewed with care.',
        footerPrivacy: 'Privacy policy',
        footerTermsShort: 'Terms',
        mug: 'Mug',
        filter: 'Filter',
        addShort: 'Add',
        of: 'of',
        cartEmpty: 'Your cart is empty.',
        continueShopping: 'Continue shopping',
        perPiece: ' / pc',
        decreaseQty: 'Decrease quantity',
        increaseQty: 'Increase quantity',
        remove: 'Remove',
        freeShippingLabel: 'Free shipping',
        qualifyNote: 'You have qualified for free shipping!',
        moreForFreePrefix: 'Add ',
        moreForFreeSuffix: ' more for free shipping',
        addedToCart: ' was added to the cart',
        customMugAdded: 'Your custom mug was added to the cart',
        cartNotReady: 'The cart is not ready yet - please try again.',
        studioResetDone: 'The design has been reset.',
        summaryTextPrefix: 'Personalized mug – printed text: "',
        summaryImagePrefix: 'Personalized mug – custom image printed',
        checkoutThanks: 'Thank you for your order!\n\nTotal: ',
        checkoutDemo: '\n\n(This is a demo – no payment is made.)',
        welcomePrefix: 'Welcome, ',
        loggedOut: 'You have logged out',
        mugColorAria: 'Mug color ',
        printColorAria: 'Print color '
    }
};

function t(key) {
    const dict = I18N[currentLang] || I18N.sv;
    if (dict[key] !== undefined) return dict[key];
    if (I18N.sv[key] !== undefined) return I18N.sv[key];
    return key;
}

// Produktens namn/beskrivning på aktiva språket
function pName(p) { return currentLang === 'en' && p.nameEn ? p.nameEn : p.name; }
function pDesc(p) { return currentLang === 'en' && p.descEn ? p.descEn : p.desc; }
// Färgets etikett på aktiva språket
function cLabel(c) { return currentLang === 'en' && c.labelEn ? c.labelEn : c.label; }

// Byter språk, sparar valet och översätter sidan (statiskt + dynamiskt innehåll)
function applyLanguage(lang) {
    currentLang = (lang === 'en') ? 'en' : 'sv';
    try { localStorage.setItem(LANG_KEY, currentLang); } catch (e) { /* localStorage tillgängligt ej */ }
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        el.placeholder = t(el.getAttribute('data-i18n-ph'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    // Menyns inloggningsetikett visar e-post när inloggad, annars "Logga in/Log in"
    const loginLabelEl = document.querySelector('#loginItem .sidebar-item-label');
    if (loginLabelEl) {
        let user = null;
        try { user = localStorage.getItem('brewcoff-user'); } catch (e) { /* inget sparat konto */ }
        loginLabelEl.textContent = user ? user : t('login');
    }

    // Markera valt språk i undermenyn
    document.querySelectorAll('#langMenu button[data-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });

    // Rita om dynamiska vyer på nya språket
    if (typeof renderProducts === 'function') renderProducts(detailList);
    const detailView = document.getElementById('productDetailView');
    if (currentDetailId && detailView && detailView.style.display !== 'none') {
        openProductDetail(currentDetailId);
    }
    if (typeof renderCart === 'function') renderCart();
    if (typeof studioBuildMugSwatches === 'function') {
        studioBuildMugSwatches();
        studioBuildTextSwatches();
    }
}

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
            <span class="product-badge">${p.category === 'motiv' ? t('mug') : t('filter')}</span>
            <div class="product-img-wrapper" onclick="openProductDetail(${p.id})">
                <img src="${p.image}" alt="${pName(p)}">
            </div>
            <h3 class="product-title" onclick="openProductDetail(${p.id})">${pName(p)}</h3>
            <p class="product-desc">${pDesc(p)}</p>
            <div class="product-bottom">
                <span class="product-price">${p.price} kr</span>
                <button class="add-cart-btn" onclick="addToCart(${p.id})">${t('addShort')}</button>
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
        (idx >= 0 ? idx + 1 : "–") + " " + t('of') + " " + detailList.length;
    const showNav = detailList.length > 1;
    document.querySelectorAll(".detail-nav").forEach(b => b.style.display = showNav ? "flex" : "none");

    document.getElementById("detailImg").src = product.image;
    document.getElementById("detailImg").alt = pName(product);
    document.getElementById("detailBadge").innerText = product.category === 'motiv' ? t('mug') : t('filter');
    document.getElementById("detailTitle").innerText = pName(product);
    document.getElementById("detailPrice").innerText = `${product.price} kr`;
    document.getElementById("detailDesc").innerText = pDesc(product);

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
    const q = query.toLowerCase();
    const filtered = products.filter(p =>
        pName(p).toLowerCase().includes(q) ||
        pDesc(p).toLowerCase().includes(q)
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
{ id: 'white',  label: 'Vit',         labelEn: 'White',       hex: '#ffffff', tint: null },
{ id: 'brown',  label: 'Kaffebrun',   labelEn: 'Coffee brown', hex: '#7c5433', tint: 'rgba(124, 84, 51, 0.60)' },
{ id: 'beige',  label: 'Beige',       labelEn: 'Beige',       hex: '#d9c1a3', tint: 'rgba(217, 193, 163, 0.55)' },
{ id: 'gray',   label: 'Grå',         labelEn: 'Grey',        hex: '#a8adb3', tint: 'rgba(168, 173, 179, 0.55)' },
{ id: 'blue',   label: 'Blå',         labelEn: 'Blue',        hex: '#7d9bb8', tint: 'rgba(125, 155, 184, 0.55)' },
{ id: 'red',    label: 'Terrakotta',  labelEn: 'Terracotta',  hex: '#b06a5e', tint: 'rgba(176, 106, 94, 0.50)' }
];

const STUDIO_TEXT_COLORS = [
{ id: 'black', label: 'Svart',    labelEn: 'Black',      hex: '#181c19' },
{ id: 'white', label: 'Vit',      labelEn: 'White',      hex: '#ffffff' },
{ id: 'brown', label: 'Mörkbrun', labelEn: 'Dark brown', hex: '#3b2720' },
{ id: 'amber', label: 'Amber',    labelEn: 'Amber',      hex: '#d97706' }
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
wrap.innerHTML = '';
STUDIO_MUG_COLORS.forEach(color => {
const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'studio-swatch' + (color.id === studioState.mugColorId ? ' active' : '');
btn.style.background = color.hex;
btn.dataset.colorId = color.id;
btn.title = cLabel(color);
btn.setAttribute('aria-label', t('mugColorAria') + cLabel(color));
btn.onclick = () => studioSelectMugColor(color.id);
wrap.appendChild(btn);
});
}

function studioBuildTextSwatches() {
const wrap = document.getElementById('studioTextSwatches');
if (!wrap) return;
wrap.innerHTML = '';
STUDIO_TEXT_COLORS.forEach(color => {
const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'studio-swatch' + (color.id === 'black' ? ' active' : '');
btn.style.background = color.hex;
btn.dataset.colorId = color.id;
btn.title = cLabel(color);
btn.setAttribute('aria-label', t('printColorAria') + cLabel(color));
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
studioStatus(t('studioResetDone'));
}

/* ------------------------------------------------------------
Åtgärder: varukorg & ladda ner
------------------------------------------------------------ */

function studioDesignSummary() {
if (studioState.mode === 'text') {
return t('summaryTextPrefix') + (studioState.text || '').trim() + '"';
}
return t('summaryImagePrefix') + (studioState.fileName ? ' (' + studioState.fileName + ')' : '');
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
if (typeof showToast === 'function') showToast(t('customMugAdded'));
else studioStatus('✓ ' + t('customMugAdded'));
} else {
studioStatus(t('cartNotReady'), true);
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
// Tar kategori-id (all/motiv/filter) så att det fungerar oavsett språk
function goToCategory(cat) {
    const pill = document.querySelector('.filter-pill[data-cat="' + cat + '"]');
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
    showToast(pName(product) + t('addedToCart'));
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
    const locale = currentLang === 'en' ? 'en-GB' : 'sv-SE';
    return amount.toLocaleString(locale) + ' kr';
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
                <p>${t('cartEmpty')}</p>
                <button class="cart-continue-btn" onclick="toggleCart()">${t('continueShopping')}</button>
            </div>`;
        footerEl.style.display = 'none';
        return;
    }

    footerEl.style.display = 'block';

    itemsEl.innerHTML = cart.map(item => {
        // Katalogprodukter översätts vid rendering (namn/beskrivning sparas på svenska)
        const p = products.find(x => x.id === item.id);
        const name = p ? pName(p) : item.name;
        const desc = p ? pDesc(p) : item.desc;
        return `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.image}" alt="${name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-name">${name}</h4>
                ${desc ? `<p class="cart-item-desc">${desc}</p>` : ''}
                <p class="cart-item-price">${formatKr(item.price)}${t('perPiece')}</p>
                <div class="cart-item-actions">
                    <div class="qty-stepper">
                        <button onclick="changeQty(${item.id}, -1)" aria-label="${t('decreaseQty')}">&minus;</button>
                        <span class="qty-value">${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)" aria-label="${t('increaseQty')}">+</button>
                    </div>
                    <button class="cart-remove-btn" onclick="removeFromCart(${item.id})">${t('remove')}</button>
                </div>
            </div>
            <span class="cart-item-line-total">${formatKr(item.price * item.qty)}</span>
        </div>
    `;
    }).join('');

    // Totaler
    const subtotal = cartSubtotal();
    const shipping = shippingCost();
    document.getElementById('cartSubtotal').textContent = formatKr(subtotal);

    const shippingEl = document.getElementById('cartShipping');
    shippingEl.textContent = shipping === 0 ? t('freeShippingLabel') : formatKr(shipping);
    shippingEl.classList.toggle('free', shipping === 0);

    document.getElementById('cartTotal').textContent = formatKr(subtotal + shipping);

    // Frakt-progress
    const noteEl = document.getElementById('shippingNote');
    const barEl = document.getElementById('shippingProgress');
    if (subtotal >= FREE_SHIPPING_LIMIT) {
        noteEl.textContent = t('qualifyNote');
        barEl.style.width = '100%';
    } else {
        noteEl.textContent = t('moreForFreePrefix') + formatKr(FREE_SHIPPING_LIMIT - subtotal) + t('moreForFreeSuffix');
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
    alert(t('checkoutThanks') + formatKr(total) + t('checkoutDemo'));
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

    const langMenu = document.getElementById('langMenu');
    const langToggle = document.getElementById('langToggle');

    function setMenu(open) {
        overlay.classList.toggle('open', open);
        sidebar.classList.toggle('open', open);
        document.body.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        // Stäng språkundermenyn när menyn stängs
        if (langMenu) langMenu.classList.toggle('open', false);
        if (langToggle) langToggle.setAttribute('aria-expanded', 'false');
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

    // Språk – fälla upp undermenyn och spara valet i localStorage
    if (langToggle && langMenu) {
        langToggle.addEventListener('click', () => {
            const open = !langMenu.classList.contains('open');
            langMenu.classList.toggle('open', open);
            langToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        langMenu.querySelectorAll('button[data-lang]').forEach((btn) => {
            btn.addEventListener('click', () => {
                applyLanguage(btn.dataset.lang);
                setMenu(false);
            });
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

    // ===== Inloggning (Rasmus) =====
    // Demo-inloggning (ingen backend): giltig e-post + lösenord = "inloggad".
    // Kontot sparas i localStorage; klicka på posten igen för att logga ut.
    const loginItem = document.getElementById('loginItem');
    const loginOverlay = document.getElementById('loginOverlay');
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginError = document.getElementById('loginError');
    const loginClose = document.getElementById('loginClose');
    const loginLabel = loginItem ? loginItem.querySelector('.sidebar-item-label') : null;
    const logoutItem = document.getElementById('logoutItem');
    let setLogin = null;

    if (loginItem && loginOverlay && loginForm && loginEmail && loginPassword) {
        const USER_KEY = 'brewcoff-user';

        setLogin = (open) => {
            loginOverlay.classList.toggle('open', open);
            document.body.classList.toggle('login-open', open);
        };

        function refreshLoginLabel() {
            const user = localStorage.getItem(USER_KEY);
            if (loginLabel) loginLabel.textContent = user ? user : t('login');
            if (logoutItem) logoutItem.classList.toggle('visible', Boolean(user));
        }

        loginItem.addEventListener('click', () => {
            // Inloggade ser sitt konto här – ingen åtgärd (loggning sker via "Logga ut")
            if (localStorage.getItem(USER_KEY)) return;
            setMenu(false);
            loginEmail.value = '';
            loginPassword.value = '';
            if (loginError) loginError.hidden = true;
            setLogin(true);
            loginEmail.focus();
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginEmail.value.trim();
            if (!email.includes('@') || loginPassword.value.length === 0) {
                if (loginError) loginError.hidden = false;
                return;
            }
            localStorage.setItem(USER_KEY, email);
            refreshLoginLabel();
            setLogin(false);
            if (typeof showToast === 'function') showToast(t('welcomePrefix') + email);
        });

        if (loginClose) loginClose.addEventListener('click', () => setLogin(false));
        loginOverlay.addEventListener('click', (e) => {
            if (e.target === loginOverlay) setLogin(false);
        });

        // "Logga ut"-knappen i botten av sidmenyn (synlig bara när inloggad)
        if (logoutItem) {
            logoutItem.addEventListener('click', () => {
                localStorage.removeItem(USER_KEY);
                refreshLoginLabel();
                if (typeof showToast === 'function') showToast(t('loggedOut'));
            });
        }

        refreshLoginLabel();
    }

    // Escape stänger först inloggningspopppen, sedan sidmenyn
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (loginOverlay && loginOverlay.classList.contains('open') && setLogin) setLogin(false);
        else setMenu(false);
    });

    // Tillämpa sparat språk (eller standardsvenska) vid sidans start
    applyLanguage(currentLang);
})();
