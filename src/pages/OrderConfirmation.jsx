import { useEffect } from "react";
import { Navigate, Link, useLocation } from "react-router";
import { CheckCircle2, Package } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../hooks/useCart";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useLocale } from "../hooks/useLocale";

function estimateDeliveryRange(locale) {
    const start = new Date();
    start.setDate(start.getDate() + 4);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const options = { month: "short", day: "numeric" };
    const dateLocale = locale === "it" ? "it-IT" : "en-US";
    return `${start.toLocaleDateString(dateLocale, options)} – ${end.toLocaleDateString(dateLocale, options)}`;
}

export default function OrderConfirmation() {
    const { t, locale } = useLocale();
    useDocumentTitle(t("orderConfirmation.success"));
    const { state } = useLocation();
    const { items, clearCart } = useCart();
    const order = state?.order;

    useEffect(() => {
        if (order && items.length > 0) {
            clearCart();
        }
    }, [order, items.length, clearCart]);

    if (!order) {
        return <Navigate to="/" replace />;
    }

    const countryLabel = order.shipping.country === "Italy" ? t("common.italy") : t("common.unitedStates");

    return (
        <div className="mx-auto max-w-xl px-6 py-12">
            <div className="text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-action" />
                <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-action">
                    {t("orderConfirmation.orderConfirmed", { number: order.number })}
                </p>
                <h1 className="mt-2 font-display text-4xl uppercase text-primary sm:text-5xl">
                    {t("orderConfirmation.success")}
                </h1>
                <p className="mt-4 text-secondary">
                    {t("orderConfirmation.thankYou", { firstName: order.shipping.firstName, email: order.shipping.email })}
                </p>
                <Link
                    to="/catalog"
                    className="mt-6 inline-block bg-action px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
                >
                    {t("orderConfirmation.continueShopping")}
                </Link>
            </div>

            <h2 className="mt-12 font-display text-2xl uppercase text-primary">{t("orderConfirmation.summary")}</h2>
            <ul className="mt-4 divide-y divide-surface">
                {order.items.map((item) => (
                    <li key={`${item.id}-${item.size}`} className="flex gap-4 py-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden bg-surface">
                            <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-primary">{item.name}</p>
                            <p className="text-sm text-secondary">
                                {t("cart.size", { size: item.size })} · {t("orderConfirmation.qty", { qty: item.quantity })}
                            </p>
                        </div>
                        <p className="text-sm font-semibold text-primary">{formatPrice(item.price * item.quantity, locale)}</p>
                    </li>
                ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-surface pt-4 text-sm text-secondary">
                <div className="flex justify-between">
                    <span>{t("common.subtotal")}</span>
                    <span>{formatPrice(order.subtotal + (order.discount ?? 0), locale)}</span>
                </div>
                {order.discount > 0 ? (
                    <div className="flex justify-between text-action">
                        <span>{t("checkout.discount")}</span>
                        <span>-{formatPrice(order.discount, locale)}</span>
                    </div>
                ) : null}
                <div className="flex justify-between">
                    <span>{t("cart.shipping")}</span>
                    <span>{order.shippingCost === 0 ? t("cart.free") : formatPrice(order.shippingCost, locale)}</span>
                </div>
                <div className="flex justify-between">
                    <span>{t("cart.tax")}</span>
                    <span>{formatPrice(order.tax, locale)}</span>
                </div>
            </div>
            <div className="flex justify-between border-t border-surface pt-4 font-semibold text-primary">
                <span>{t("cart.total")}</span>
                <span>{formatPrice(order.total, locale)}</span>
            </div>
            <p className="mt-2 text-xs text-secondary">
                {t("orderConfirmation.paidWith", { last4: order.cardLast4, total: formatPrice(order.total, locale) })}
            </p>

            <div className="mt-8 bg-surface p-4 text-sm">
                <div className="flex items-start gap-3">
                    <Package className="mt-0.5 h-5 w-5 shrink-0 text-action" />
                    <div>
                        <p className="font-medium text-primary">
                            {t("orderConfirmation.estimatedDelivery", { range: estimateDeliveryRange(locale) })}
                        </p>
                        <p className="text-secondary">{t("orderConfirmation.trackingNotice")}</p>
                    </div>
                </div>
                <hr className="my-4 border-canvas" />
                <p className="text-secondary">
                    {order.shipping.firstName} {order.shipping.lastName}
                    <br />
                    {order.shipping.street}{order.shipping.apartment ? `, ${order.shipping.apartment}` : ""}
                    <br />
                    {order.shipping.city}, {order.shipping.state} {order.shipping.zip}, {countryLabel}
                </p>
            </div>

            <p className="mt-6 text-center text-xs text-secondary">{t("orderConfirmation.needHand")}</p>
        </div>
    );
}
