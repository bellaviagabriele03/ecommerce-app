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

const CATEGORY_FACETS = [
    { key: null, label: "All products" },
    { key: "sneakers", label: "Sneakers" },
    { key: "hoodie", label: "Hoodies" },
    { key: "tshirt", label: "Tees" },
    { key: "cap", label: "Caps" },
    { key: "accessory", label: "Accessories" },
];

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

const RATING_FACETS = [4, 3];

function filterProducts(products, searchParams) {
    const category = searchParams.get("category");
    const isNew = searchParams.get("isNew") === "true";
    const query = searchParams.get("q")?.trim().toLowerCase();
    const minPrice = Number(searchParams.get("minPrice") ?? 0);
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
    const minRating = Number(searchParams.get("rating") ?? 0);
    const inStockOnly = searchParams.get("inStock") === "true";

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
        if (product.price < minPrice) {
            return false;
        }
        if (maxPrice !== null && product.price > maxPrice) {
            return false;
        }
        if (minRating && product.rating.rate < minRating) {
            return false;
        }
        if (inStockOnly && !product.inStock) {
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
    const rating = Number(searchParams.get("rating") ?? 0);
    const inStockOnly = searchParams.get("inStock") === "true";
    const priceCeiling = products ? Math.ceil(Math.max(...products.map((p) => p.price)) / 10) * 10 : 200;
    const [maxPriceInput, setMaxPriceInput] = useState(
        searchParams.get("maxPrice") ?? ""
    );
    const debouncedMaxPrice = useDebounce(maxPriceInput, 300);
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
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (debouncedMaxPrice) {
                    next.set("maxPrice", debouncedMaxPrice);
                } else {
                    next.delete("maxPrice");
                }
                return next;
            },
            { replace: true }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedMaxPrice]);

    function toggleParam(key, value) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (next.get(key) === String(value)) {
                next.delete(key);
            } else {
                next.set(key, value);
            }
            return next;
        });
    }

    function resetFilters() {
        setQueryInput("");
        setMaxPriceInput("");
        setSearchParams({});
    }

    function selectCategory(key) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("isNew");
            if (key) {
                next.set("category", key);
            } else {
                next.delete("category");
            }
            return next;
        });
    }

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

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
                <aside className="space-y-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Category</p>
                        <ul className="mt-3 space-y-1">
                            {CATEGORY_FACETS.map((facet) => {
                                const count = facet.key
                                    ? products?.filter((p) => p.category === facet.key).length ?? 0
                                    : products?.length ?? 0;
                                const active = (facet.key ?? null) === (category ?? null) && !isNew;

                                return (
                                    <li key={facet.label}>
                                        <button
                                            onClick={() => selectCategory(facet.key)}
                                            className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                                                active
                                                    ? "border border-action text-action"
                                                    : "border border-transparent text-secondary hover:text-primary"
                                            }`}
                                        >
                                            <span>{facet.label}</span>
                                            <span>{count}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Price range</p>
                            <p className="text-xs text-secondary">
                                $0 &mdash; ${maxPriceInput || priceCeiling}
                            </p>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={priceCeiling}
                            value={maxPriceInput || priceCeiling}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            className="mt-4 w-full accent-action"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Rating</p>
                        <ul className="mt-3 space-y-1">
                            {RATING_FACETS.map((stars) => (
                                <li key={stars}>
                                    <button
                                        onClick={() => toggleParam("rating", stars)}
                                        className={`flex w-full items-center px-3 py-2 text-sm transition-colors ${
                                            rating === stars
                                                ? "border border-action text-action"
                                                : "border border-transparent text-secondary hover:text-primary"
                                        }`}
                                    >
                                        {stars}★ &amp; up
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-secondary">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={() => toggleParam("inStock", "true")}
                            className="accent-action"
                        />
                        In stock only
                    </label>

                    <button onClick={resetFilters} className="text-sm text-secondary underline hover:text-primary">
                        Reset filters
                    </button>
                </aside>

                <div>
                    <div className="relative max-w-md">
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
                                onRetry={resetFilters}
                                retryLabel="Reset filters"
                            />
                        ) : (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-3">
                                {visibleProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
