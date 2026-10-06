// Beräkningar för varukorgen

import { FREE_SHIPPING_LIMIT, SHIPPING_COST } from '../data/products.js'

export function cartSubtotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function cartTotalQty(items) {
    return items.reduce((sum, item) => sum + item.qty, 0);
}

export function shippingCost(items) {
    if (items.length === 0) return 0;
    return cartSubtotal(items) >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_COST;
}

export function formatKr(amount) {
    return amount.toLocaleString('sv-SE') + ' kr';
}
