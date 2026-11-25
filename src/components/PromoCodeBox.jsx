import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Check } from "lucide-react";
import { useLocale } from "../hooks/useLocale";

export default function PromoCodeBox({ promo }) {
    const { t } = useLocale();
    const [showOverlay, setShowOverlay] = useState(false);

    function handleApply() {
        if (promo.apply()) {
            setShowOverlay(true);
            setTimeout(() => setShowOverlay(false), 1800);
        }
    }

    return (
        <div className="space-y-2">
            <AnimatePresence>
                {showOverlay ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
                    >
                        <div className="flex items-center gap-2 bg-action px-6 py-4 text-sm font-bold uppercase tracking-wide text-primary shadow-lg">
                            <BadgeCheck className="h-5 w-5" />
                            {t("checkout.discountApplied")}
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={promo.input}
                    onChange={(e) => promo.setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleApply();
                        }
                    }}
                    placeholder={t("cart.promoCode")}
                    aria-label={t("cart.promoCode")}
                    className="search-bar min-w-0 flex-1 px-3 py-2 text-sm uppercase text-primary placeholder-secondary outline-none focus:ring-1 focus:ring-action"
                />
                <button
                    type="button"
                    onClick={handleApply}
                    className="shrink-0 border border-secondary px-4 text-sm font-semibold uppercase text-primary hover:border-primary"
                >
                    {t("cart.apply")}
                </button>
            </div>

            {promo.error ? <p className="text-xs text-error">{t("checkout.invalidCode")}</p> : null}

            {promo.discountRate > 0 ? (
                <div className="flex items-center justify-between border border-action px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 text-primary">
                        <Check className="h-4 w-4 text-action" />
                        {t("checkout.codeApplied", { code: promo.appliedCode, percent: Math.round(promo.discountRate * 100) })}
                    </span>
                    <button type="button" onClick={promo.clear} className="text-xs text-secondary underline hover:text-primary">
                        {t("cart.remove")}
                    </button>
                </div>
            ) : null}
        </div>
    );
}
