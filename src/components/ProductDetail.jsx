// Produktdetaljvyn (Neo)

import { useEffect } from 'react'

export default function ProductDetail({ list, productId, onBack, onNavigate, onAddToCart }) {
    // Piltangenter: föregående / nästa produkt
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowLeft') onNavigate(-1);
            if (e.key === 'ArrowRight') onNavigate(1);
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onNavigate]);

    const product = list.find(p => p.id === productId);
    if (!product) return null;

    // Position "x av y" + dölj pilarna om det bara är en produkt i listan
    const idx = list.findIndex(p => p.id === productId);
    const showNav = list.length > 1;

    return (
        <div id="productDetailView" className="product-detail-view">
            <div className="product-detail-container">
                <button className="back-btn" onClick={onBack}>
                    &larr; Tillbaka till produkter
                </button>

                {showNav && (
                    <button className="detail-nav detail-nav-prev" onClick={() => onNavigate(-1)} aria-label="Föregående produkt">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                )}

                <div className="product-detail-grid">
                    <div className="product-detail-img-box">
                        <img id="detailImg" src={product.image} alt={product.name} />
                    </div>
                    <div className="product-detail-info">
                        <span id="detailBadge" className="product-badge detail-badge">{product.category === 'motiv' ? 'Mugg' : 'Filter'}</span>
                        <h1 id="detailTitle" className="detail-title">{product.name}</h1>
                        <p id="detailPosition" className="detail-position">{idx + 1} av {list.length}</p>
                        <p id="detailPrice" className="product-price detail-price">{product.price} kr</p>
                        <p id="detailDesc" className="detail-desc">{product.desc}</p>

                        <div className="detail-actions">
                            <button className="btn-primary detail-add-btn" id="detailAddToCartBtn" onClick={() => onAddToCart(product.id)}>Lägg till i varukorg</button>
                        </div>
                    </div>
                </div>

                {showNav && (
                    <button className="detail-nav detail-nav-next" onClick={() => onNavigate(1)} aria-label="Nästa produkt">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                )}
            </div>
        </div>
    );
}
