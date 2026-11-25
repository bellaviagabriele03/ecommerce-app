import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Lock, CreditCard } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useLocale } from "../../hooks/useLocale";
import { usePromoCode } from "../../hooks/usePromoCode";
import { createOrder } from "../../services/ordersApi";
import { formatPrice } from "../../utils/formatPrice";
import { calculateTotals } from "../../utils/pricing";
import PromoCodeBox from "../../components/PromoCodeBox";

function generateOrderNumber() {
    return `SN-${Math.floor(10000 + Math.random() * 90000)}`;
}

function cardBrand(cardNumber) {
    return cardNumber.replace(/\s/g, "").startsWith("4") ? "Visa" : "Card";
}

export default function Review() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { shipping, payment } = state ?? {};
    const { items, subtotal, clearCart } = useCart();
    const { user, updateProfile } = useAuth();
    const { t, locale } = useLocale();
    const promo = usePromoCode();
    const [placing, setPlacing] = useState(false);

    if (!shipping || !payment) {
        return <Navigate to="/checkout/shipping" replace />;
    }

    const countryLabel = shipping.country === "Italy" ? t("common.italy") : t("common.unitedStates");
    const { discount, discountedSubtotal, shipping: shippingCost, tax, total } = calculateTotals(
        subtotal,
        promo.discountRate
    );

    async function placeOrder() {
        const cardLast4 = payment.cardNumber.replace(/\s/g, "").slice(-4);
        const order = {
            number: generateOrderNumber(),
            items,
            shipping,
            cardLast4,
            subtotal: discountedSubtotal,
            shippingCost,
            tax,
            total,
        };

        setPlacing(true);
        try {
            if (user) {
                await createOrder(user.id, order);
                await updateProfile({
                    shipping_address: shipping,
                    payment_method: { brand: cardBrand(payment.cardNumber), last4: cardLast4, expiry: payment.expiry },
                });
            }
        } catch {
            // saving order history / profile failed; still complete the purchase for the shopper
        }

        clearCart();
        promo.clear();
        navigate("/order-confirmation", { state: { order } });
    }

    return (
        <div className="space-y-6">
            <h2 className="font-display text-2xl uppercase text-primary">{t("checkout.oneLastLook")}</h2>
            <p className="text-sm text-secondary">
                {t("checkout.reviewIntro")}
            </p>

            <div className="space-y-4 bg-surface p-4 text-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium text-primary">{t("checkout.shipTo")}</p>
                        <p className="mt-1 text-secondary">
                            {shipping.firstName} {shipping.lastName} &middot; {shipping.email}
                            <br />
                            {shipping.street}{shipping.apartment ? `, ${shipping.apartment}` : ""}
                            <br />
                            {shipping.city}, {shipping.state} {shipping.zip}, {countryLabel}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/checkout/shipping", { state: { shipping } })}
                        className="text-action hover:underline"
                    >
                        {t("checkout.edit")}
                    </button>
                </div>

                <hr className="border-canvas" />

                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-secondary">
                        <CreditCard className="h-4 w-4" />
                        {t("checkout.cardEndingIn", {
                            last4: payment.cardNumber.replace(/\s/g, "").slice(-4),
                            expiry: payment.expiry,
                        })}
                    </div>
                    <button
                        onClick={() => navigate("/checkout/payment", { state: { shipping, payment } })}
                        className="text-action hover:underline"
                    >
                        {t("checkout.edit")}
                    </button>
                </div>
            </div>

            <PromoCodeBox promo={promo} />

            <div className="space-y-2 border-t border-surface pt-4 text-sm text-secondary">
                <div className="flex justify-between">
                    <span>{t("cart.subtotal", { count: items.length })}</span>
                    <span>{formatPrice(subtotal, locale)}</span>
                </div>
                {discount > 0 ? (
                    <div className="flex justify-between text-action">
                        <span>{t("checkout.discount")} ({Math.round(promo.discountRate * 100)}%)</span>
                        <span>-{formatPrice(discount, locale)}</span>
                    </div>
                ) : null}
                <div className="flex justify-between">
                    <span>{t("cart.shipping")}</span>
                    <span>{shippingCost === 0 ? t("cart.free") : formatPrice(shippingCost, locale)}</span>
                </div>
                <div className="flex justify-between">
                    <span>{t("cart.tax")}</span>
                    <span>{formatPrice(tax, locale)}</span>
                </div>
            </div>

            <div className="flex justify-between border-t border-surface pt-4 font-semibold text-primary">
                <span>{t("cart.total")}</span>
                <span>{formatPrice(total, locale)}</span>
            </div>

            <button
                onClick={placeOrder}
                disabled={placing}
                className="flex w-full items-center justify-center gap-2 bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:opacity-60"
            >
                {placing ? t("checkout.placingOrder") : t("checkout.placeOrder", { total: formatPrice(total, locale) })} <Lock className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-secondary">
                {t("checkout.termsNotice")}
            </p>
        </div>
    );
}
