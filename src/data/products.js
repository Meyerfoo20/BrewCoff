// Produktdata och globala konstanter

export const products = [
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
    }
];

export const FILTER_PILLS = [
    { cat: 'all', label: 'Alla' },
    { cat: 'motiv', label: 'Muggar' },
    { cat: 'filter', label: 'Kaffefilter' }
];

// ===== Varukorg (Anton Gren) =====
export const FREE_SHIPPING_LIMIT = 299; // Fri frakt över 299 kr (enligt toppbaren)
export const SHIPPING_COST = 49;
export const CART_STORAGE_KEY = 'brewcoff_cart';

// ===== Konton (Rasmus) =====
export const ACCOUNTS_KEY = 'brewcoff-accounts';
export const USER_KEY = 'brewcoff-user';
export const NAME_KEY = 'brewcoff-user-name';
export const TYPE_KEY = 'brewcoff-user-type';
export const ORDERS_PREFIX = 'brewcoff-orders:';
export const ADMIN_CODE = '0005';
export const TYPE_LABELS = { kund: 'Vanlig kund', foretag: 'Företagkund', admin: 'Admin' };

// ===== Studio (Jakob) =====
export const STUDIO_PRICE = 149;
export const STUDIO_CART_ID = 9901; // Studio-muggar får id 9901 + hash av designen

export const STUDIO_MUG_COLORS = [
    { id: 'white',  label: 'Vit',         hex: '#ffffff', tint: null },
    { id: 'brown',  label: 'Kaffebrun',   hex: '#7c5433', tint: 'rgba(124, 84, 51, 0.60)' },
    { id: 'beige',  label: 'Beige',       hex: '#d9c1a3', tint: 'rgba(217, 193, 163, 0.55)' },
    { id: 'gray',   label: 'Grå',         hex: '#a8adb3', tint: 'rgba(168, 173, 179, 0.55)' },
    { id: 'blue',   label: 'Blå',         hex: '#7d9bb8', tint: 'rgba(125, 155, 184, 0.55)' },
    { id: 'red',    label: 'Terrakotta',  hex: '#b06a5e', tint: 'rgba(176, 106, 94, 0.50)' }
];

export const STUDIO_TEXT_COLORS = [
    { id: 'black', label: 'Svart',    hex: '#181c19' },
    { id: 'white', label: 'Vit',      hex: '#ffffff' },
    { id: 'brown', label: 'Mörkbrun', hex: '#3b2720' },
    { id: 'amber', label: 'Amber',    hex: '#d97706' }
];

export const STUDIO_FONTS = {
    serif:        '700 1em "Playfair Display", Georgia, serif',
    'serif-italic': 'italic 700 1em "Playfair Display", Georgia, serif',
    sans:         '700 1em "Plus Jakarta Sans", sans-serif'
};

// Tryckyta på muggen, relativt mot muggbilden (mät i Stock-Mugg.png):
// kroppen sträcker sig ca x 14-70% (handtaget ligger till höger om det),
// vertikalt ca 12-90%. Tryckytan undviker kanten och handtaget.
export const STUDIO_PRINT_BOX = { cx: 0.42, cy: 0.535, w: 0.36, h: 0.48 };
