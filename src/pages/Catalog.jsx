import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { getProducts } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import ProductCard from "../components/ProductCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const CATEGORY_GROUPS = {
    sneakers: ["sneakers"],
    hoodie: ["hoodie"],
    tshirt: ["tshirt"],
    cap: ["cap"],
    accessory: ["accessory"],
    clothing: ["hoodie", "tshirt"],
    accessories: ["cap", "accessory"],
};

const HEADERS = {
    sneakers: { eyebrow: "FOOTWEAR", title: "Sneakers" },
    hoodie: { eyebrow: "APPAREL", title: "Hoodies" },
    tshirt: { eyebrow: "APPAREL", title: "Tees" },
    cap: { eyebrow: "FINISHING TOUCHES", title: "Caps" },
    accessory: { eyebrow: "FINISHING TOUCHES", title: "Accessories" },
    clothing: { eyebrow: "APPAREL", title: "Clothing" },
    accessories: { eyebrow: "FINISHING TOUCHES", title: "Accessories" },
    isNew: { eyebrow: "FRESH IN THE ROTATION", title: "New drops" },
    default: { eyebrow: "CURATED FOR THE EVERYDAY", title: "The Rotation" },
};

function filterProducts(products, searchParams) {
    const category = searchParams.get("category");
    const isNew = searchParams.get("isNew") === "true";
    const query = searchParams.get("q")?.trim().toLowerCase();

    return products.filter((product) => {
        if (category && !CATEGORY_GROUPS[category]?.includes(product.category)) {
            return false;
        }
        if (isNew && !product.isNew) {
            return false;
        }
        if (query && !product.name.toLowerCase().includes(query)) {
            return false;
        }
        return true;
    });
}

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);
    const [queryInput, setQueryInput] = useState(searchParams.get("q") ?? "");
    const debouncedQuery = useDebounce(queryInput, 300);

    const category = searchParams.get("category");
    const isNew = searchParams.get("isNew") === "true";
    const header = HEADERS[isNew ? "isNew" : category] ?? HEADERS.default;

    useEffect(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (debouncedQuery) {
                    next.set("q", debouncedQuery);
                } else {
                    next.delete("q");
                }
                return next;
            },
            { replace: true }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery]);

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

    const visibleProducts = products ? filterProducts(products, searchParams) : [];

    return (
        <div className="px-6 py-8">
            <p className="text-sm text-secondary">
                <Link to="/" className="hover:text-primary">Home</Link> / {header.title}
            </p>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-action">{header.eyebrow}</p>
                    <h1 className="font-display text-5xl uppercase text-primary">{header.title}</h1>
                </div>
                {products ? (
                    <p className="text-sm text-secondary">{visibleProducts.length} pieces</p>
                ) : null}
            </div>

            <div className="relative mt-8 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                <input
                    type="search"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Search products"
                    className="search-bar w-full py-2 pl-9 pr-3 text-sm text-primary placeholder-secondary outline-none focus:ring-1 focus:ring-action"
                />
            </div>

            <div className="mt-6">
                {error ? (
                    <ErrorState
                        message="We couldn't load the catalog."
                        onRetry={() => window.location.reload()}
                    />
                ) : !products ? (
                    <LoadingState label="Loading products..." />
                ) : visibleProducts.length === 0 ? (
                    <ErrorState
                        title="No results."
                        message="Nothing matches this selection right now."
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
