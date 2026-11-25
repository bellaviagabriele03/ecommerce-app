import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Truck, RotateCcw, Package } from "lucide-react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import ErrorState from "../components/ErrorState";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const QUICK_LINKS = [
    { label: "Sneakers", category: "sneakers" },
    { label: "Hoodies", category: "hoodie" },
    { label: "Tees", category: "tshirt" },
    { label: "Caps", category: "cap" },
    { label: "Accessories", category: "accessory" },
];

export default function Home() {
    useDocumentTitle();
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        getProducts()
            .then((data) => {
                if (!cancelled) setProducts(data);
            })
            .catch((err) => {
                if (!cancelled) setError(err);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    if (error) {
        return <ErrorState message="We couldn't load the homepage." onRetry={() => window.location.reload()} />;
    }

    if (!products) {
        return (
            <div className="animate-pulse">
                <div className="h-[70vh] bg-surface" />
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-6 py-14 md:grid-cols-4">
                    {Array.from({ length: 4 }, (_, i) => (
                        <ProductCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    const featured = products.filter((p) => p.isNew).slice(0, 4);
    const hero = featured[0] ?? products[0];

    return (
        <div>
            <section className="relative overflow-hidden">
                <img
                    src={hero.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/70 to-canvas/10" />
                <div className="relative px-6 py-24 sm:py-32">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                        <span className="h-2 w-2 bg-action" /> The October Edit / Vol. 026
                    </p>
                    <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-newdrop">
                        Just landed — {hero.name}
                    </p>
                    <h1 className="mt-2 max-w-xl font-display text-6xl uppercase leading-[0.95] text-primary sm:text-7xl">
                        Next up. Never basic.
                    </h1>
                    <p className="mt-6 max-w-md text-secondary">
                        Built for the streets. Made for your rotation. Meet the new {hero.name}.
                    </p>
                    <Link
                        to={`/catalog/${hero.slug}`}
                        className="mt-8 inline-block bg-action px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
                    >
                        Shop the drop
                    </Link>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 border-y border-surface px-6 py-6 text-sm text-secondary sm:grid-cols-3">
                <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-action" /> Free shipping $150+</p>
                <p className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-action" /> Easy 14-day returns</p>
                <p className="flex items-center gap-2"><Package className="h-4 w-4 text-action" /> Small runs. Considered picks.</p>
            </section>

            <section className="px-6 py-14">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-action">Fresh in the rotation</p>
                        <h2 className="font-display text-5xl uppercase text-primary">Featured drops</h2>
                    </div>
                    <Link to="/catalog" className="text-sm text-secondary hover:text-primary">View all →</Link>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                    {featured.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-surface pt-6 text-sm">
                    <p className="text-secondary">Find your next</p>
                    {QUICK_LINKS.map((link) => (
                        <Link
                            key={link.category}
                            to={`/catalog?category=${link.category}`}
                            className="font-medium text-primary hover:text-action"
                        >
                            {link.label} ↗
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
