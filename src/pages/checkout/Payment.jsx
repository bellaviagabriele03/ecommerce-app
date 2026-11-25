import { useEffect } from "react";
import { Navigate, useNavigate, useOutletContext } from "react-router";
import { Construction } from "lucide-react";
import { useLocale } from "../../hooks/useLocale";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const REDIRECT_DELAY = 2500;

export default function Payment() {
    const navigate = useNavigate();
    const { shipping } = useOutletContext();
    const { t } = useLocale();
    useDocumentTitle(t("checkout.paymentDetails"));

    useEffect(() => {
        const timeout = setTimeout(() => navigate("/"), REDIRECT_DELAY);
        return () => clearTimeout(timeout);
    }, [navigate]);

    if (!shipping) {
        return <Navigate to="/checkout/shipping" replace />;
    }

    return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
            <Construction className="h-10 w-10 text-action" />
            <h2 className="font-display text-3xl uppercase text-primary">{t("checkout.workInProgress")}</h2>
            <p className="max-w-sm text-secondary">{t("checkout.paymentNotImplemented")}</p>
            <p className="text-sm text-secondary">{t("checkout.redirectingHome")}</p>
        </div>
    );
}
