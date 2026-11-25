import { useState } from "react";
import { Navigate, useNavigate, useOutletContext } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, CreditCard, BadgeCheck } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { createOrder } from "../../services/ordersApi";
import { formatPrice } from "../../utils/formatPrice";

const FREE_SHIPPING_THRESHOLD = 150;
const FLAT_SHIPPING = 9.95;
const TAX_RATE = 0.08;
const DISCOUNT_CODES = { WELCOME10: 0.1 };

function generateOrderNumber() {
    return `SN-${Math.floor(10000 + Math.random() * 90000)}`;
}

export default function Review() {
    const navigate = useNavigate();
    const { shipping, payment } = useOutletContext();
    const { items, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const [promoInput, setPromoInput] = useState("");
    const [discountRate, setDiscountRate] = useState(0);
    const [promoError, setPromoError] = useState(null);
    const [showPromoAccepted, setShowPromoAccepted] = useState(false);
    const [placing, setPlacing] = useState(false);

    if (!shipping || !payment) {
        return <Navigate to="/checkout/shipping" replace />;
    }

    const discount = subtotal * discountRate;
    const discountedSubtotal = subtotal - discount;
    const shippingCost = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const tax = discountedSubtotal * TAX_RATE;
    const total = discountedSubtotal + shippingCost + tax;

    function applyPromo() {
        const rate = DISCOUNT_CODES[promoInput.trim().toUpperCase()];
        if (rate) {
            setDiscountRate(rate);
            setPromoError(null);
            setShowPromoAccepted(true);
            setTimeout(() => setShowPromoAccepted(false), 1800);
        } else {
            setDiscountRate(0);
            setPromoError("Invalid code.");
        }
    }

    async function placeOrder() {
        const order = {
            number: generateOrderNumber(),
            items,
            shipping,
            cardLast4: payment.cardNumber.replace(/\s/g, "").slice(-4),
            subtotal: discountedSubtotal,
            shippingCost,
            tax,
            total,
        };

        setPlacing(true);
        try {
            if (user) {
                await createOrder(user.id, order);
            }
        } catch {
            // order history save failed; still complete the purchase for the shopper
        }

        clearCart();
        navigate("/order-confirmation", { state: { order } });
    }

    return (
        <div className="relative space-y-6">
            <AnimatePresence>
                {showPromoAccepted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
                    >
                        <div className="flex items-center gap-2 bg-action px-6 py-4 text-sm font-bold uppercase tracking-wide text-primary shadow-lg">
                            <BadgeCheck className="h-5 w-5" />
                            Discount code applied
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <h2 className="font-display text-2xl uppercase text-primary">One last look.</h2>
            <p className="text-sm text-secondary">
                Your next rotation is almost yours. Check the details below before placing your order.
            </p>

            <div className="space-y-4 bg-surface p-4 text-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium text-primary">Ship to</p>
                        <p className="mt-1 text-secondary">
                            {shipping.firstName} {shipping.lastName} &middot; {shipping.email}
                            <br />
                            {shipping.street}{shipping.apartment ? `, ${shipping.apartment}` : ""}
                            <br />
                            {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}
                        </p>
                    </div>
                    <button onClick={() => navigate("/checkout/shipping")} className="text-action hover:underline">
                        Edit
                    </button>
                </div>

                <hr className="border-canvas" />

                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-secondary">
                        <CreditCard className="h-4 w-4" />
                        Card ending in {payment.cardNumber.replace(/\s/g, "").slice(-4)} &middot; Exp. {payment.expiry}
                    </div>
                    <button onClick={() => navigate("/checkout/payment")} className="text-action hover:underline">
                        Edit
                    </button>
                </div>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code"
                    className="search-bar flex-1 px-3 py-2 text-sm text-primary placeholder-secondary outline-none focus:ring-1 focus:ring-action"
                />
                <button
                    type="button"
                    onClick={applyPromo}
                    className="border border-secondary px-4 text-sm font-semibold uppercase text-primary hover:border-primary"
                >
                    Apply
                </button>
            </div>
            {promoError ? <p className="text-xs text-error">{promoError}</p> : null}
            {discountRate > 0 ? <p className="text-xs text-action">Code applied &mdash; {discountRate * 100}% off.</p> : null}

            <div className="space-y-2 border-t border-surface pt-4 text-sm text-secondary">
                <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 ? (
                    <div className="flex justify-between text-action">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                    </div>
                ) : null}
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Estimated tax (8%)</span>
                    <span>{formatPrice(tax)}</span>
                </div>
            </div>

            <div className="flex justify-between border-t border-surface pt-4 font-semibold text-primary">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
            </div>

            <button
                onClick={placeOrder}
                disabled={placing}
                className="flex w-full items-center justify-center gap-2 bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:opacity-60"
            >
                {placing ? "Placing order..." : `Place order — ${formatPrice(total)}`} <Lock className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-secondary">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    );
}
