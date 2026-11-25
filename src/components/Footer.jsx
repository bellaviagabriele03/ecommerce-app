import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className="border-t border-surface px-6 py-10 text-primary">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="logo text-xl">SHOPNOVA</p>
                    <p className="mt-2 text-sm text-secondary">Independent taste. Everyday rotation.</p>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-secondary">
                    <Link to="/shipping-returns" className="hover:text-primary">Shipping &amp; returns</Link>
                    <Link to="/size-guide" className="hover:text-primary">Size guide</Link>
                    <Link to="/contact" className="hover:text-primary">Contact</Link>
                    <a href="#" target="_blank" rel="noreferrer" className="hover:text-primary">Instagram ↗</a>
                </div>
            </div>
            <div className="mt-8 flex flex-col gap-2 border-t border-surface pt-6 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between">
                <p>&copy; {new Date().getFullYear()} ShopNova</p>
                <div className="flex gap-4">
                    <Link to="/privacy" className="hover:text-primary">Privacy</Link>
                    <Link to="/terms" className="hover:text-primary">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
