import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Search, User, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useLocale } from "../hooks/useLocale";
import CountrySwitcher from "./CountrySwitcher";

const navLinkClass = ({ isActive }) =>
    `transition-colors ${isActive ? "text-primary font-medium" : "text-secondary hover:text-primary"}`;

export default function Navbar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const { count } = useCart();
    const { user } = useAuth();
    const { t } = useLocale();

    const links = [
        { name: t("nav.newDrops"), path: "/catalog?isNew=true" },
        { name: t("nav.sneakers"), path: "/catalog?category=sneakers" },
        { name: t("nav.clothing"), path: "/catalog?category=clothing" },
        { name: t("nav.accessories"), path: "/catalog?category=accessories" },
    ];

    function handleSearch(e) {
        e.preventDefault();
        setMenuOpen(false);
        navigate(query.trim() ? `/catalog?q=${encodeURIComponent(query.trim())}` : "/catalog");
    }

    return (
        <header className="border-b border-surface text-primary">
            <div className="bg-surface py-2 text-center text-xs tracking-wide text-secondary">
                {t("nav.freeShipping")}
            </div>

            <nav className="flex items-center justify-between gap-6 px-6 py-4">
                <div className="flex items-center gap-10">
                    <button
                        onClick={() => setMenuOpen((open) => !open)}
                        aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
                        aria-expanded={menuOpen}
                        className="md:hidden"
                    >
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                    <NavLink className="logo text-2xl" to="/">
                        SHOPNOVA
                    </NavLink>
                    <div className="hidden items-center gap-6 text-sm md:flex">
                        {links.map((l) => (
                            <NavLink key={l.name} className={navLinkClass} to={l.path}>
                                {l.name}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <form className="relative hidden sm:block" onSubmit={handleSearch}>
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t("nav.searchPlaceholder")}
                            className="search-bar w-48 py-2 pl-9 pr-3 text-sm text-primary placeholder-secondary outline-none focus:ring-1 focus:ring-action md:w-64"
                        />
                    </form>
                    <NavLink to="/wishlist" aria-label={t("nav.wishlist")} className="hidden sm:block">
                        <Heart className="h-5 w-5" />
                    </NavLink>
                    <NavLink
                        to={user ? "/account/profile" : "/account/login"}
                        aria-label={t("nav.account")}
                        className="flex items-center gap-1"
                    >
                        <User className="h-5 w-5" />
                        {user ? (
                            <span className="hidden text-sm lg:inline">
                                {user.user_metadata?.full_name?.split(" ")[0] ?? t("nav.account")}
                            </span>
                        ) : null}
                    </NavLink>
                    <CountrySwitcher />
                    <NavLink to="/cart" aria-label={`${t("nav.cart")}${count > 0 ? ` (${count})` : ""}`} className="relative">
                        <ShoppingBag className="h-5 w-5" />
                        {count > 0 ? (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-action text-[10px] font-bold text-primary">
                                {count}
                            </span>
                        ) : null}
                    </NavLink>
                </div>
            </nav>

            {menuOpen ? (
                <div className="border-t border-surface px-6 py-4 md:hidden">
                    <form className="relative" onSubmit={handleSearch}>
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t("nav.searchPlaceholder")}
                            className="search-bar w-full py-2 pl-9 pr-3 text-sm text-primary placeholder-secondary outline-none focus:ring-1 focus:ring-action"
                        />
                    </form>
                    <div className="mt-4 flex flex-col gap-4 text-sm">
                        {links.map((l) => (
                            <NavLink key={l.name} className={navLinkClass} to={l.path} onClick={() => setMenuOpen(false)}>
                                {l.name}
                            </NavLink>
                        ))}
                        <NavLink className={navLinkClass} to="/wishlist" onClick={() => setMenuOpen(false)}>
                            {t("nav.wishlist")}
                        </NavLink>
                    </div>
                </div>
            ) : null}
        </header>
    );
}
