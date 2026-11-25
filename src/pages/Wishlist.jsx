import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Heart } from "lucide-react";
import { getProducts } from "../services/api";
import { useWishlist } from "../hooks/useWishlist";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import ErrorState from "../components/ErrorState";

export default function Wishlist() {
    const { ids } = useWishlist();
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
        return <ErrorState message="We couldn't load your wishlist." onRetry={() => window.location.reload()} />;
    }

    if (!products) {
        return (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-6 py-8 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    const wishlisted = products.filter((p) => ids.includes(p.id));

    if (wishlisted.length === 0) {
        return (
            <div className="px-6 py-8">
                <div className="mt-16 flex flex-col items-center gap-4 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-surface">
                        <Heart className="h-8 w-8 text-secondary" />
                    </div>
                    <h1 className="font-display text-4xl uppercase text-primary">Nothing saved yet.</h1>
                    <p className="max-w-sm text-secondary">
                        Tap the heart on anything you like and it'll show up here.
                    </p>
                    <Link
                        to="/catalog"
                        className="mt-2 bg-action px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
                    >
                        Explore the rotation
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-8">
            <h1 className="font-display text-5xl uppercase text-primary">Wishlist</h1>
            <p className="mt-2 text-sm text-secondary">{wishlisted.length} saved</p>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                {wishlisted.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
