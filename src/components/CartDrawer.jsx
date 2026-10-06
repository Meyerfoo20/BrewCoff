// Varukorg – draglåd + flytande knapp (Anton Gren)

import { useEffect, useRef } from 'react'
import { FREE_SHIPPING_LIMIT } from '../data/products.js'
import { cartSubtotal, cartTotalQty, shippingCost, formatKr } from '../lib/cart.js'
import { drawMugDesign, subscribeAssets } from '../lib/studio.js'

// Mini-canvas för custom muggar: ritar designen (text eller bild)
function MugPreview({ design }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const redraw = () => {
            const canvas = canvasRef.current;
            if (canvas) drawMugDesign(canvas, design);
        };
        redraw();
        return subscribeAssets(redraw);
    }, [design]);

    return <canvas className="cart-mug-canvas" ref={canvasRef} width="76" height="76"></canvas>;
}

export default function CartDrawer({ open, items, onClose, onOpen, onChangeQty, onRemove, onCheckout }) {
    const totalQty = cartTotalQty(items);
    const subtotal = cartSubtotal(items);
    const shipping = shippingCost(items);

    // Esc stänger varukorgen
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    return (
        <>
            <div className={open ? 'cart-overlay open' : 'cart-overlay'} onClick={onClose}></div>
            <div className={open ? 'cart-drawer open' : 'cart-drawer'} id="cartDrawer" role="dialog" aria-modal="true" aria-label="Varukorg">
                <div className="cart-header">
                    <h2 className="cart-title">Varukorg</h2>
                    <button className="cart-close-btn" onClick={onClose} aria-label="Stäng varukorgen">&times;</button>
                </div>

                <div className="cart-items" id="cartItems">
                    {items.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">☕</div>
                            <p>Din varukorg är tom.</p>
                            <button className="cart-continue-btn" onClick={onClose}>Fortsätt handla</button>
                        </div>
                    ) : (
                        items.map(item => (
                            <div className="cart-item" key={item.id}>
                                <div className={'cart-item-img' + (item.design ? ' cart-item-img-custom' : '')}>
                                    {item.design
                                        ? <MugPreview design={item.design} />
                                        : <img src={item.image} alt={item.name} />}
                                </div>
                                <div className="cart-item-info">
                                    <h4 className="cart-item-name">{item.name}</h4>
                                    {item.desc && <p className="cart-item-desc">{item.desc}</p>}
                                    <p className="cart-item-price">{formatKr(item.price)} / st</p>
                                    <div className="cart-item-actions">
                                        <div className="qty-stepper">
                                            <button onClick={() => onChangeQty(item.id, -1)} aria-label="Minska antal">&minus;</button>
                                            <span className="qty-value">{item.qty}</span>
                                            <button onClick={() => onChangeQty(item.id, 1)} aria-label="Öka antal">+</button>
                                        </div>
                                        <button className="cart-remove-btn" onClick={() => onRemove(item.id)}>Ta bort</button>
                                    </div>
                                </div>
                                <span className="cart-item-line-total">{formatKr(item.price * item.qty)}</span>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="cart-footer" id="cartFooter">
                        <p className="cart-free-shipping">☕ Fri frakt vid beställningar över 299 kr</p>
                        <p className="cart-shipping-note" id="shippingNote">
                            {subtotal >= FREE_SHIPPING_LIMIT
                                ? 'Du har kvalificerat dig för fri frakt!'
                                : 'Köp för ' + formatKr(FREE_SHIPPING_LIMIT - subtotal) + ' till för fri frakt'}
                        </p>
                        <div className="cart-progress-track">
                            <div className="cart-progress-fill" id="shippingProgress" style={{ width: Math.min(100, (subtotal / FREE_SHIPPING_LIMIT) * 100) + '%' }}></div>
                        </div>
                        <div className="cart-total-row">
                            <span>Subtotal</span>
                            <span id="cartSubtotal">{formatKr(subtotal)}</span>
                        </div>
                        <div className="cart-total-row">
                            <span>Frakt</span>
                            <span id="cartShipping" className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'Fri frakt' : formatKr(shipping)}</span>
                        </div>
                        <div className="cart-total-row cart-grand-total">
                            <span>Totalt</span>
                            <span id="cartTotal">{formatKr(subtotal + shipping)}</span>
                        </div>
                        <button className="cart-checkout-btn" onClick={onCheckout}>Till kassan</button>
                    </div>
                )}
            </div>

            {/* Flytande varukorgsknapp */}
            <button className="cart-fab" onClick={onOpen} aria-label="Öppna varukorgen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {totalQty > 0 && <span className="cart-count" id="cartCount">{totalQty}</span>}
            </button>
        </>
    );
}
