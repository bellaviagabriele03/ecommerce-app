import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Search, User, ShoppingBag } from "lucide-react";

const links = [
    { name: "New drops", path: "/catalog?isNew=true" },
    { name: "Sneakers", path: "/catalog?category=sneakers" },
    { name: "Clothing", path: "/catalog?category=clothing" },
    { name: "Accessories", path: "/catalog?category=accessories" },
];

const navLinkClass = ({ isActive }) =>
    `transition-colors ${isActive ? "text-primary font-medium" : "text-secondary hover:text-primary"}`;

export default function Navbar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    function handleSearch(e) {
        e.preventDefault();
        navigate(query.trim() ? `/catalog?q=${encodeURIComponent(query.trim())}` : "/catalog");
    }

    return (
        <header className="border-b border-surface text-primary">
            <div className="bg-surface py-2 text-center text-xs tracking-wide text-secondary">
                FREE SHIPPING ON ORDERS $150+ &middot; US DELIVERY
            </div>

            <nav className="flex items-center justify-between gap-6 px-6 py-4">
                <div className="flex items-center gap-10">
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
                            placeholder="Search the store"
                            className="search-bar w-48 py-2 pl-9 pr-3 text-sm text-primary placeholder-secondary outline-none focus:ring-1 focus:ring-action md:w-64"
                        />
                    </form>
                    <NavLink to="/account/login" aria-label="Account">
                        <User className="h-5 w-5" />
                    </NavLink>
                    <NavLink to="/cart" aria-label="Cart" className="relative">
                        <ShoppingBag className="h-5 w-5" />
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}