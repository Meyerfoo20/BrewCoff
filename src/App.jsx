// BrewCoff – React-omvandling av index-vanilla.html + script.js

import { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Hero from './components/Hero.jsx'
import CatalogHeader from './components/CatalogHeader.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import Studio from './components/Studio.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import LoginDialog from './components/LoginDialog.jsx'
import AccountDialog from './components/AccountDialog.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './lib/firebase.js'
import {
    products as defaultProducts,
    FILTER_PILLS,
    CART_STORAGE_KEY,
    STUDIO_CART_ID,
} from './data/products.js'
import { cartSubtotal, shippingCost, formatKr } from './lib/cart.js'
import {
    loadCartFromStorage,
    loadCart,
    saveCart,
    saveOrder,
    loadUserProfile,
    storageSet
} from './lib/storage.js'
import { loadProducts, seedProducts, saveProduct, deleteProduct, nextProductId } from './lib/products.js'

export default function App() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [detailId, setDetailId] = useState(null); // null = huvudvyn
    const [cart, setCart] = useState(() => loadCartFromStorage());
    const [cartReady, setCartReady] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [user, setUser] = useState(null);
    const [loginOpen, setLoginOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);
    const [products, setProducts] = useState(defaultProducts);
    const [productsLoaded, setProductsLoaded] = useState(false);
    const [productsFromCloud, setProductsFromCloud] = useState(false);
    const toastTimer = useRef(null);

    // Visade produkter: sökning har företräde, annars aktivt filter
    const detailList = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (q) {
            return products.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.desc.toLowerCase().includes(q)
            );
        }
        return activeCategory === 'all'
            ? products
            : products.filter(p => p.category === activeCategory);
    }, [products, activeCategory, searchQuery]);

    // Produktkatalogen från Firestore (standardlistan om samlingen är tom)
    useEffect(() => {
        let active = true;
        loadProducts()
            .then(({ items, fromCloud }) => {
                if (!active) return;
                setProducts(items);
                setProductsFromCloud(fromCloud);
                setProductsLoaded(true);
            })
            .catch(() => { /* behåll standardlistan */ });
        return () => { active = false; };
    }, []);

    // Håll varukorgen i synk med katalogen (nya priser, borttagna produkter)
    useEffect(() => {
        if (!productsLoaded || !cartReady) return;
        setCart(prev => {
            let changed = false;
            const next = [];
            prev.forEach(item => {
                if (item.id >= STUDIO_CART_ID) { next.push(item); return; }
                const product = products.find(p => p.id === item.id);
                if (!product) { changed = true; return; }
                const updated = { ...item, name: product.name, category: product.category, price: product.price, desc: product.desc, image: product.image };
                if (updated.name !== item.name || updated.category !== item.category || updated.price !== item.price ||
                    updated.desc !== item.desc || updated.image !== item.image) changed = true;
                next.push(updated);
            });
            return changed ? next : prev;
        });
    }, [products, productsLoaded, cartReady]);

    // Navbar – "scrolled"-klass efter lite scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Ladda konto och varukorg från Firebase när autentisering ändras
    useEffect(() => {
        let active = true;
        const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
            setCartReady(false);
            if (!firebaseUser) {
                if (active) {
                    setUser(null);
                    setCart(loadCartFromStorage());
                    setCartReady(true);
                }
                return;
            }
            try {
                const [profile, cloudCart] = await Promise.all([
                    loadUserProfile(firebaseUser.uid),
                    loadCart(firebaseUser.uid)
                ]);
                if (!active) return;
                const account = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: profile?.name || '',
                    type: profile?.type || 'kund',
                    role: profile?.role === 'admin' ? 'admin' : 'user'
                };
                setUser(account);
                const guestCart = loadCartFromStorage();
                const nextCart = cloudCart === null ? guestCart : cloudCart;
                setCart(nextCart);
                if (cloudCart === null && guestCart.length) await saveCart(firebaseUser.uid, guestCart);
            } catch (loadError) {
                if (active) {
                    setUser({ uid: firebaseUser.uid, email: firebaseUser.email, name: '', type: 'kund', role: 'user' });
                    setCart(loadCartFromStorage());
                }
            }
            if (active) setCartReady(true);
        });
        return () => { active = false; unsubscribe(); };
    }, []);

    useEffect(() => {
        if (!cartReady) return;
        if (user?.uid) {
            saveCart(user.uid, cart).catch(() => showToast('Varukorgen kunde inte synkroniseras'));
        } else {
            storageSet(CART_STORAGE_KEY, JSON.stringify(cart));
        }
    }, [cart, cartReady, user]);

    // Scroll-lås: sidmeny/kontodialoger via klasser, varukorg via inline-stil
    useEffect(() => {
        document.body.classList.toggle('menu-open', menuOpen);
    }, [menuOpen]);

    useEffect(() => {
        document.body.classList.toggle('login-open', loginOpen || accountOpen || adminOpen);
        document.body.style.overflow = cartOpen ? 'hidden' : '';
    }, [cartOpen, loginOpen, accountOpen, adminOpen]);

    // Adminpanelen stängs om användaren inte (längre) är admin
    useEffect(() => {
        if (user?.role !== 'admin') setAdminOpen(false);
    }, [user]);

    useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

    // ===== Toast-notis =====
    function showToast(message) {
        setToast(message);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 2200);
    }

    // ===== Varukorg =====
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        setCart(prev => {
            const existing = prev.find(item => item.id === productId);
            if (existing) {
                return prev.map(item => item.id === productId ? { ...item, qty: item.qty + 1 } : item);
            }
            return [...prev, {
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                desc: product.desc,
                image: product.image,
                qty: 1
            }];
        });
        showToast(product.name + ' lades i varukorgen');
    }

    // Custom mugg från studio – samma design landar i samma rad
    function addStudioItem(item) {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id
                    ? { ...i, qty: i.qty + 1, desc: item.desc, design: item.design, image: item.image || i.image }
                    : i);
            }
            return [...prev, { ...item, image: item.image || 'Images/Stock-Mugg.png' }];
        });
        showToast('Din custom mugg lades i varukorgen');
    }

    function changeQty(productId, delta) {
        setCart(prev => {
            const item = prev.find(i => i.id === productId);
            if (!item) return prev;
            const qty = item.qty + delta;
            if (qty <= 0) return prev.filter(i => i.id !== productId);
            return prev.map(i => i.id === productId ? { ...i, qty } : i);
        });
    }

    function removeFromCart(productId) {
        setCart(prev => prev.filter(i => i.id !== productId));
    }

    // Kassa (demo) – sparar köphistorik för inloggade användare
    async function checkout() {
        if (cart.length === 0) return;
        const items = cart.map(item => ({ name: item.name, price: item.price, qty: item.qty }));
        const total = cartSubtotal(cart) + shippingCost(cart);
        alert('Tack för din beställning!\n\nTotalt: ' + formatKr(total) +
            '\n\n(Detta är en demo – ingen betalning görs.)');
        if (user && items.length > 0) {
            try {
                await saveOrder(user.uid, { date: new Date().toISOString(), items, total });
            } catch (saveError) {
                showToast('Beställningen kunde inte sparas till kontot');
                return;
            }
        }
        setCart([]);
        setCartOpen(false);
    }

    // ===== Inloggning & konto =====
    function handleLoginSuccess(account) {
        setLoginOpen(false);
        showToast('Välkommen, ' + (account.name || account.email));
    }

    function handleNameSaved(name) {
        setUser(u => (u ? { ...u, name } : u));
        showToast(name ? 'Kontonamnet uppdaterades' : 'Kontonamnet togs bort');
    }

    async function handleLogout() {
        await signOut(auth);
        setAccountOpen(false);
        setAdminOpen(false);
        setMenuOpen(false);
        showToast('Du har loggat ut');
    }

    function handleSidebarAccount() {
        setMenuOpen(false);
        if (user) setAccountOpen(true);
        else setLoginOpen(true);
    }

    // ===== Admin: produkter =====
    // Första ändringen kopierar standardlistan till Firestore
    async function ensureProductsInCloud() {
        if (productsFromCloud) return;
        await seedProducts(products);
        setProductsFromCloud(true);
    }

    async function handleAdminSave(product) {
        await ensureProductsInCloud();
        const isNew = product.id === null || product.id === undefined;
        const saved = await saveProduct({ ...product, id: isNew ? nextProductId(products) : product.id });
        setProducts(prev => (isNew ? [...prev, saved] : prev.map(p => p.id === saved.id ? saved : p)));
        setProductsLoaded(true);
        showToast(saved.name + (isNew ? ' lades till' : ' sparades'));
    }

    async function handleAdminDelete(productId) {
        await ensureProductsInCloud();
        await deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        setProductsLoaded(true);
        if (detailId === productId) setDetailId(null);
        showToast('Produkten togs bort');
    }

    function handleSidebarAdmin() {
        setMenuOpen(false);
        setAdminOpen(true);
    }

    // ===== Tema =====
    function toggleTheme() {
        const root = document.documentElement;
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('brewcoff-theme', next); } catch (e) { /* ignorera */ }
    }

    // ===== Navigering =====
    function scrollToSection(id) {
        if (detailId !== null) setDetailId(null);
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 30);
    }

    function handleLogoClick() {
        if (detailId !== null) setDetailId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleNavigate(id) {
        setMenuOpen(false);
        scrollToSection(id);
    }

    function openProductDetail(productId) {
        setDetailId(productId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showMainView() {
        setDetailId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Hoppar till föregående/nästa produkt (går runt i listan)
    function navigateProduct(delta) {
        if (detailList.length <= 1) return;
        const idx = detailList.findIndex(p => p.id === detailId);
        const next = detailList[(idx + delta + detailList.length) % detailList.length];
        setDetailId(next.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Footerns länkar – klicka rätt filterpill
    function goToCategory(pillLabel) {
        const pill = FILTER_PILLS.find(p => p.label === pillLabel);
        if (pill) {
            setActiveCategory(pill.cat);
            setSearchQuery('');
        }
        scrollToSection('produkter');
    }

    return (
        <>
            <Navbar scrolled={scrolled} menuOpen={menuOpen} onLogoClick={handleLogoClick} onNavigate={handleNavigate} onMenuToggle={() => setMenuOpen(o => !o)} />
            <Sidebar open={menuOpen} user={user} onClose={() => setMenuOpen(false)} onLoginOrAccount={handleSidebarAccount} onToggleTheme={toggleTheme} onLogout={handleLogout} onAdmin={handleSidebarAdmin} />

            {detailId === null ? (
                <div id="mainView">
                    <Hero onNavigate={scrollToSection} />
                    <CatalogHeader
                        activeCategory={activeCategory}
                        searchQuery={searchQuery}
                        onCategory={cat => { setActiveCategory(cat); setSearchQuery(''); }}
                        onSearch={setSearchQuery}
                    />
                    <ProductGrid items={detailList} onOpenDetail={openProductDetail} onAddToCart={addToCart} />
                    <Studio onAddToCart={addStudioItem} />

                    {/* Om oss (Rasmus) */}
                    <section id="om-oss" className="about-section">
                        <div className="about-inner">
                            <div className="about-header">
                                <span className="section-tag">Om oss</span>
                                <h2>Kaffe med hjärta, muggar med karaktär</h2>
                                <p>
                                    BrewCoff startade med en enkel idé: att fika ska vara en liten stund
                                    för dig själv. Vi designar våra muggar i små serier och lägger stor
                                    vikt vid både materialkvalitet och hållbarhet, så att din mugg håller
                                    i många kaffebryggor.
                                </p>
                            </div>
                            <div className="about-cards">
                                <div className="about-card">
                                    <div className="about-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" /><line x1="6" x2="6" y1="2" y2="4" /><line x1="10" x2="10" y1="2" y2="4" /><line x1="14" x2="14" y1="2" y2="4" /></svg>
                                    </div>
                                    <h3>Hantverkskvalitet</h3>
                                    <p>Våra muggar formas i tålig porslin och kontrolleras för hand innan de skickas vidare till dig.</p>
                                </div>
                                <div className="about-card">
                                    <div className="about-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                                    </div>
                                    <h3>Omsorg om miljön</h3>
                                    <p>Vi packar i papper, inte plast, och väljer material som håller i många år – inte bara en säsong.</p>
                                </div>
                                <div className="about-card">
                                    <div className="about-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
                                    </div>
                                    <h3>Snabb leverans</h3>
                                    <p>Vi skickar din order inom 1–3 vardagar, och frakten är gratis vid köp över 299 kr.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <ProductDetail list={detailList} productId={detailId} onBack={showMainView} onNavigate={navigateProduct} onAddToCart={addToCart} />
            )}

            <Footer onGoToCategory={goToCategory} onNavigate={handleNavigate} />

            <CartDrawer
                open={cartOpen}
                items={cart}
                onClose={() => setCartOpen(false)}
                onOpen={() => setCartOpen(true)}
                onChangeQty={changeQty}
                onRemove={removeFromCart}
                onCheckout={checkout}
            />

            {toast && <div className="cart-toast show" id="cartToast">{toast}</div>}

            <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={handleLoginSuccess} />
            <AccountDialog open={accountOpen} user={user} onClose={() => setAccountOpen(false)} onNameSaved={handleNameSaved} />
            {user?.role === 'admin' && (
                <AdminPanel open={adminOpen} products={products} onClose={() => setAdminOpen(false)} onSave={handleAdminSave} onDelete={handleAdminDelete} />
            )}
        </>
    );
}
