import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/formatPrice";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useLocale } from "../hooks/useLocale";
import { usePromoCode } from "../hooks/usePromoCode";
import { calculateTotals, FREE_SHIPPING_THRESHOLD } from "../utils/pricing";
import PromoCodeBox from "../components/PromoCodeBox";

export default function Cart() {
    const { t, locale } = useLocale();
    useDocumentTitle(t("cart.title"));
    const { items, count, subtotal, removeItem, increaseQty, decreaseQty } = useCart();
    const promo = usePromoCode();

    if (items.length === 0) {
        return (
            <div className="px-6 py-8">
                <p className="text-sm text-secondary">
                    <Link to="/catalog" className="hover:text-primary">{t("cart.continueShopping")}</Link>
                </p>

                <div className="mt-16 flex flex-col items-center gap-4 text-center">
                    <p className="text-sm text-secondary">{t("cart.emptyItems")}</p>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-surface">
                        <ShoppingBag className="h-8 w-8 text-secondary" />
                    </div>
                    <h1 className="font-display text-4xl uppercase text-primary">{t("cart.emptyTitle")}</h1>
                    <p className="max-w-sm text-secondary">
                        {t("cart.emptyMessage")}
                    </p>
                    <Link
                        to="/catalog"
                        className="mt-2 bg-action px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
                    >
                        {t("cart.exploreRotation")}
                    </Link>
                </div>
            </div>
        );
    }

    const { discount, discountedSubtotal, shipping, tax, total, remainingForFreeShipping } = calculateTotals(
        subtotal,
        promo.discountRate
    );

    return (
        <div className="px-6 py-8">
            <p className="text-sm text-secondary">
                <Link to="/catalog" className="hover:text-primary">{t("cart.continueShopping")}</Link>
            </p>

            <div className="mt-4 flex items-end justify-between">
                <h1 className="font-display text-5xl uppercase text-primary">{t("cart.title")}</h1>
                <p className="text-sm text-secondary">{t("cart.items", { count })}</p>
            </div>

            <div className="mt-8 bg-surface p-4">
                {remainingForFreeShipping === 0 ? (
                    <p className="text-sm text-primary">{t("cart.freeShippingUnlocked")}</p>
                ) : (
                    <p className="text-sm text-secondary">
                        {t("cart.freeShippingRemaining", { amount: formatPrice(remainingForFreeShipping, locale) })}
                    </p>
                )}
                <div className="mt-3 h-1 w-full bg-canvas">
                    <div
                        className="h-1 bg-action transition-all"
                        style={{ width: `${Math.min(100, (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                </div>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
                <ul className="divide-y divide-surface">
                    {items.map((item) => (
                        <li key={`${item.id}-${item.size}`} className="flex gap-4 py-6">
                            <Link to={`/catalog/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden bg-surface">
                                <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                            </Link>
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <Link to={`/catalog/${item.slug}`} className="font-medium text-primary hover:text-action">
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-secondary">{t("cart.size", { size: item.size })}</p>
                                    </div>
                                    <p className="font-semibold text-primary">{formatPrice(item.price, locale)}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center border border-surface">
                                        <button
                                            onClick={() => decreaseQty(item.id, item.size)}
                                            className="px-3 py-1 text-primary hover:text-action"
                                            aria-label={t("cart.decrease")}
                                        >
                                            −
                                        </button>
                                        <span className="px-3 text-sm text-primary">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQty(item.id, item.size)}
                                            className="px-3 py-1 text-primary hover:text-action"
                                            aria-label={t("cart.increase")}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id, item.size)}
                                        className="text-sm text-secondary underline hover:text-primary"
                                    >
                                        {t("cart.remove")}
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="h-fit space-y-6 bg-surface p-6">
                    <PromoCodeBox promo={promo} />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-secondary">
                            <span>{t("cart.subtotal", { count })}</span>
                            <span>{formatPrice(subtotal, locale)}</span>
                        </div>
                        {discount > 0 ? (
                            <div className="flex justify-between text-action">
                                <span>{t("checkout.discount")} ({Math.round(promo.discountRate * 100)}%)</span>
                                <span>-{formatPrice(discount, locale)}</span>
                            </div>
                        ) : null}
                        <div className="flex justify-between text-secondary">
                            <span>{t("cart.shipping")}</span>
                            <span>{shipping === 0 ? t("cart.free") : formatPrice(shipping, locale)}</span>
                        </div>
                        <div className="flex justify-between text-secondary">
                            <span>{t("cart.tax")}</span>
                            <span>{formatPrice(tax, locale)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between border-t border-canvas pt-4 font-semibold text-primary">
                        <span>{t("cart.total")}</span>
                        <span>{formatPrice(total, locale)}</span>
                    </div>

                    <Link
                        to="/checkout"
                        className="block bg-action py-4 text-center text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
                    >
                        {t("cart.checkout", { total: formatPrice(total, locale) })}
                    </Link>
                    <p className="text-center text-xs text-secondary">
                        {t("cart.secureCheckout")}
                    </p>
                </div>
            </div>
        </div>
    );
}
