export const FREE_SHIPPING_THRESHOLD = 150;
export const FLAT_SHIPPING = 9.95;
export const TAX_RATE = 0.08;
export const DISCOUNT_CODES = { WELCOME10: 0.1 };

export function discountRateFor(code) {
    return code ? DISCOUNT_CODES[code.trim().toUpperCase()] ?? 0 : 0;
}

export function calculateTotals(subtotal, discountRate = 0) {
    const discount = subtotal * discountRate;
    const discountedSubtotal = subtotal - discount;
    const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const tax = discountedSubtotal * TAX_RATE;
    return {
        discount,
        discountedSubtotal,
        shipping,
        tax,
        total: discountedSubtotal + shipping + tax,
        remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal),
    };
}
