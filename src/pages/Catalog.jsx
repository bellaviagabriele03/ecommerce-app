import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { getProducts } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";
import { useLocale } from "../hooks/useLocale";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import ErrorState from "../components/ErrorState";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const CATEGORY_GROUPS = {
    sneakers: ["sneakers"],
    hoodie: ["hoodie"],
    tshirt: ["tshirt"],
    cap: ["cap"],
    accessory: ["accessory"],
    clothing: ["hoodie", "tshirt"],
    accessories: ["cap", "accessory"],
};

function getCategoryFacets(t) {
    return [
        { key: null, labelKey: "catalog.allProducts" },
        { key: "sneakers", labelKey: "nav.sneakers" },
        { key: "hoodie", labelKey: "catalog.title.hoodie" },
        { key: "tshirt", labelKey: "catalog.title.tshirt" },
        { key: "cap", labelKey: "catalog.title.cap" },
        { key: "accessory", labelKey: "nav.accessories" },
    ].map((facet) => ({ ...facet, label: t(facet.labelKey) }));
}

const RATING_FACETS = [4, 3];

const PAGE_SIZE = 9;

function getSortOptions(t) {
    return [
        { key: "newest", label: t("catalog.sortNewest") },
        { key: "price-asc", label: t("catalog.sortPriceAsc") },
        { key: "price-desc", label: t("catalog.sortPriceDesc") },
        { key: "name-asc", label: t("catalog.sortNameAsc") },
        { key: "rating-desc", label: t("catalog.sortRating") },
    ];
}

function sortProducts(products, sortKey) {
    const sorted = [...products];

    switch (sortKey) {
        case "price-asc":
            return sorted.sort((a, b) => a.price - b.price);
        case "price-desc":
            return sorted.sort((a, b) => b.price - a.price);
        case "name-asc":
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case "rating-desc":
            return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
        default:
            return sorted;
    }
}

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
    const { t } = useLocale();
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
    const headerKey = isNew ? "isNew" : (category ?? "default");
    const header = {
        eyebrow: t(`catalog.eyebrow.${headerKey}`),
        title: t(`catalog.title.${headerKey}`),
    };
    useDocumentTitle(header.title);
    const categoryFacets = getCategoryFacets(t);
    const sortOptions = getSortOptions(t);

    useEffect(() => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (debouncedQuery) {
                    next.set("q", debouncedQuery);
                } else {
                    next.delete("q");
                }
                next.delete("page");
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
                next.delete("page");
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
            next.delete("page");
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
            next.delete("page");
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

    const sortKey = searchParams.get("sort") ?? "newest";
    const visibleProducts = products
        ? sortProducts(filterProducts(products, searchParams), sortKey)
        : [];

    const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PAGE_SIZE));
    const page = Math.min(Number(searchParams.get("page") ?? 1), totalPages);
    const pageProducts = visibleProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function goToPage(nextPage) {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (nextPage <= 1) {
                next.delete("page");
            } else {
                next.set("page", nextPage);
            }
            return next;
        });
    }

    return (
        <div className="px-6 py-8">
            <p className="text-sm text-secondary">
                <Link to="/" className="hover:text-primary">{t("common.home")}</Link> / {header.title}
            </p>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-action">{header.eyebrow}</p>
                    <h1 className="font-display text-5xl uppercase text-primary">{header.title}</h1>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
                <aside className="space-y-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{t("catalog.category")}</p>
                        <ul className="mt-3 flex flex-wrap gap-2 lg:block lg:space-y-1">
                            {categoryFacets.map((facet) => {
                                const count = facet.key
                                    ? products?.filter((p) => p.category === facet.key).length ?? 0
                                    : products?.length ?? 0;
                                const active = (facet.key ?? null) === (category ?? null) && !isNew;

                                return (
                                    <li key={facet.labelKey}>
                                        <button
                                            onClick={() => selectCategory(facet.key)}
                                            className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors lg:w-full lg:justify-between lg:rounded-none ${
                                                active
                                                    ? "border border-action text-action"
                                                    : "border border-surface text-secondary hover:text-primary lg:border-transparent"
                                            }`}
                                        >
                                            <span>{facet.label}</span>
                                            <span className="hidden lg:inline">{count}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{t("catalog.priceRange")}</p>
                            <p className="text-xs text-secondary">
                                $0 &mdash; ${maxPriceInput || priceCeiling}
                            </p>
                        </div>
                        <input
                            type="range"
                            aria-label={t("catalog.priceRange")}
                            min={0}
                            max={priceCeiling}
                            value={maxPriceInput || priceCeiling}
                            onChange={(e) => setMaxPriceInput(e.target.value)}
                            className="mt-4 w-full accent-action"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{t("catalog.rating")}</p>
                        <ul className="mt-3 flex flex-wrap gap-2 lg:block lg:space-y-1">
                            {RATING_FACETS.map((stars) => (
                                <li key={stars}>
                                    <button
                                        onClick={() => toggleParam("rating", stars)}
                                        className={`flex items-center rounded-full px-3 py-2 text-sm transition-colors lg:w-full lg:rounded-none ${
                                            rating === stars
                                                ? "border border-action text-action"
                                                : "border border-surface text-secondary hover:text-primary lg:border-transparent"
                                        }`}
                                    >
                                        {t("catalog.ratingUp", { stars })}
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
                        {t("catalog.inStockOnly")}
                    </label>

                    <button onClick={resetFilters} className="text-sm text-secondary underline hover:text-primary">
                        {t("common.resetFilters")}
                    </button>
                </aside>

                <div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
                            <input
                                type="search"
                                value={queryInput}
                                onChange={(e) => setQueryInput(e.target.value)}
                                placeholder={t("catalog.searchPlaceholder")}
                                className="search-bar w-full py-2 pl-9 pr-3 text-sm text-primary placeholder-secondary outline-none focus:ring-1 focus:ring-action"
                            />
                        </div>
                        <select
                            value={sortKey}
                            onChange={(e) =>
                                setSearchParams((prev) => {
                                    const next = new URLSearchParams(prev);
                                    next.set("sort", e.target.value);
                                    next.delete("page");
                                    return next;
                                })
                            }
                            className="search-bar py-2 px-3 text-sm text-primary outline-none focus:ring-1 focus:ring-action"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.key} value={option.key}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {products && visibleProducts.length > 0 ? (
                        <p className="mt-3 text-sm text-secondary">
                            {t("catalog.showing", {
                                from: (page - 1) * PAGE_SIZE + 1,
                                to: Math.min(page * PAGE_SIZE, visibleProducts.length),
                                total: visibleProducts.length,
                            })}
                        </p>
                    ) : null}

                    <div className="mt-6">
                        {error ? (
                            <ErrorState
                                message={t("catalog.errorMessage")}
                                onRetry={() => window.location.reload()}
                            />
                        ) : !products ? (
                            <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-3">
                                {Array.from({ length: 9 }, (_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : visibleProducts.length === 0 ? (
                            <ErrorState
                                title={t("catalog.noResultsTitle")}
                                message={t("catalog.noResultsMessage")}
                                onRetry={resetFilters}
                                retryLabel={t("common.resetFilters")}
                            />
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-3">
                                    {pageProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {totalPages > 1 ? (
                                    <div className="mt-10 flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => goToPage(page - 1)}
                                            disabled={page <= 1}
                                            className="px-3 py-2 text-sm text-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {t("catalog.prev")}
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                            <button
                                                key={n}
                                                onClick={() => goToPage(n)}
                                                className={`h-8 w-8 text-sm transition-colors ${
                                                    n === page
                                                        ? "bg-action text-primary"
                                                        : "text-secondary hover:text-primary"
                                                }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => goToPage(page + 1)}
                                            disabled={page >= totalPages}
                                            className="px-3 py-2 text-sm text-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {t("catalog.next")}
                                        </button>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
