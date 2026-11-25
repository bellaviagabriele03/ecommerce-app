import { Link } from "react-router";
import { useLocale } from "../hooks/useLocale";

export default function Footer() {
    const { t } = useLocale();

    return (
        <footer className="border-t border-surface px-6 py-10 text-primary">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="logo text-xl">SHOPNOVA</p>
                    <p className="mt-2 text-sm text-secondary">{t("footer.tagline")}</p>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-secondary">
                    <Link to="/shipping-returns" className="hover:text-primary">{t("footer.shippingReturns")}</Link>
                    <Link to="/size-guide" className="hover:text-primary">{t("footer.sizeGuide")}</Link>
                    <Link to="/contact" className="hover:text-primary">{t("footer.contact")}</Link>
                    <a href="#" target="_blank" rel="noreferrer" className="hover:text-primary">{t("footer.instagram")} ↗</a>
                </div>
            </div>
            <div className="mt-8 flex flex-col gap-2 border-t border-surface pt-6 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between">
                <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
                <div className="flex gap-4">
                    <Link to="/privacy" className="hover:text-primary">{t("footer.privacy")}</Link>
                    <Link to="/terms" className="hover:text-primary">{t("footer.terms")}</Link>
                </div>
            </div>
        </footer>
    );
}
