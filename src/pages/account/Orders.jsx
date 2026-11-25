import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Package } from "lucide-react";
import { getOrdersForUser } from "../../services/ordersApi";
import { formatPrice } from "../../utils/formatPrice";
import { useLocale } from "../../hooks/useLocale";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Orders() {
    const { t, locale } = useLocale();
    useDocumentTitle(t("account.myOrders"));
    const [orders, setOrders] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        getOrdersForUser()
            .then((data) => {
                if (!cancelled) setOrders(data);
            })
            .catch((err) => {
                if (!cancelled) setError(err);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (error) {
        return <ErrorState message={t("account.errorOrders")} onRetry={() => window.location.reload()} />;
    }

    if (!orders) {
        return <LoadingState />;
    }

    return (
        <div className="mx-auto max-w-2xl px-6 py-12">
            <h1 className="font-display text-4xl uppercase text-primary">{t("account.myOrders")}</h1>

            {orders.length === 0 ? (
                <div className="mt-10 flex flex-col items-center gap-3 text-center">
                    <Package className="h-10 w-10 text-secondary" />
                    <p className="text-secondary">{t("account.noOrders")}</p>
                    <Link to="/catalog" className="mt-2 text-sm font-semibold text-action hover:underline">
                        {t("account.exploreRotation")}
                    </Link>
                </div>
            ) : (
                <ul className="mt-8 divide-y divide-surface">
                    {orders.map((order) => (
                        <li key={order.id} className="py-6">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-primary">#{order.order_number}</p>
                                <p className="text-sm text-secondary">
                                    {new Date(order.created_at).toLocaleDateString(locale === "it" ? "it-IT" : "en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <p className="mt-1 text-sm text-secondary">
                                {order.items.length} {order.items.length > 1 ? t("account.items") : t("account.item")}
                            </p>
                            <p className="mt-1 font-semibold text-primary">{formatPrice(order.total, locale)}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
