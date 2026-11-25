import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProductBySlug, getProducts } from "../services/api";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { useLocale } from "../hooks/useLocale";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import ErrorState from "../components/ErrorState";
import ProductCard from "../components/ProductCard";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function ProductDetail() {
    const { slug } = useParams();
    return <ProductDetailView key={slug} slug={slug} />;
}

function ProductDetailView({ slug }) {
    const { addItem } = useCart();
    const { addToast } = useToast();
    const { t, locale } = useLocale();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    useDocumentTitle(product?.name);

    useEffect(() => {
        let cancelled = false;

        getProductBySlug(slug)
            .then((data) => {
                if (cancelled) return;
                setProduct(data);
                return getProducts().then((all) => {
                    if (cancelled) return;
                    setRelated(
                        all.filter((p) => p.category === data.category && p.id !== data.id).slice(0, 2)
                    );
                });
            })
            .catch((err) => {
                if (!cancelled) setError(err);
            });

        return () => {
            cancelled = true;
        };
    }, [slug]);

    if (error) {
        return (
            <ErrorState
                title={t("product.notFoundTitle")}
                message={t("product.notFoundMessage")}
            />
        );
    }

    if (!product) {
        return <ProductDetailSkeleton />;
    }

    const categoryLabel = t(`category.${product.category}`);
    const effectiveSize = selectedSize ?? product.sizes[0];
    const description = locale === "en" ? product.descriptionEn ?? product.description : product.description;
    const sizeLabel = (size) => (size === "Unica" && locale === "en" ? "One Size" : size);

    return (
        <div className="px-6 py-8">
            <p className="text-sm text-secondary">
                <Link to="/" className="hover:text-primary">{t("common.home")}</Link> /{" "}
                <Link to={`/catalog?category=${product.category}`} className="hover:text-primary">{categoryLabel}</Link> /{" "}
                {product.name}
            </p>

            <div className="mt-6 grid gap-10 lg:grid-cols-2">
                <div className="relative aspect-square overflow-hidden bg-surface">
                    {!product.inStock ? (
                        <span className="absolute left-3 top-3 bg-error px-2 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                            {t("product.soldOut")}
                        </span>
                    ) : product.isNew ? (
                        <span className="absolute left-3 top-3 bg-newdrop px-2 py-1 text-xs font-bold uppercase tracking-wide text-canvas">
                            {t("product.newDrop")}
                        </span>
                    ) : null}
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                </div>

                <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-action">
                        SHOPNOVA / {String(product.id).padStart(3, "0")}
                    </p>
                    <h1 className="font-display text-4xl uppercase text-primary">{product.name}</h1>

                    <div className="mt-2 flex items-center justify-between">
                        <p className="text-xl font-semibold text-primary">{formatPrice(product.price, locale)}</p>
                        <p className="text-sm text-secondary">
                            {product.inStock ? t("product.inStock") : t("product.outOfStock")}
                        </p>
                    </div>

                    <hr className="my-6 border-surface" />

                    <p className="text-sm font-medium text-primary">{t("product.selectSize")}</p>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`border px-3 py-2 text-sm transition-colors ${
                                    effectiveSize === size
                                        ? "border-action bg-action text-primary"
                                        : "border-surface text-primary hover:border-secondary"
                                }`}
                            >
                                {sizeLabel(size)}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={!product.inStock}
                        onClick={() => {
                            addItem(product, effectiveSize);
                            addToast({
                                title: t("toast.addedToBag"),
                                message: `${product.name} · ${categoryLabel} · ${sizeLabel(effectiveSize)}`,
                                actionTo: "/cart",
                                actionLabel: t("toast.viewBag"),
                            });
                        }}
                        className="mt-6 w-full bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:bg-surface disabled:text-secondary"
                    >
                        {product.inStock
                            ? t("product.addToBag", { price: formatPrice(product.price, locale) })
                            : t("product.soldOut")}
                    </button>

                    <hr className="my-6 border-surface" />

                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">{t("product.builtForRotation")}</p>
                    <p className="mt-2 text-sm text-secondary">{description}</p>
                    <p className="mt-4 text-xs text-secondary">
                        {t("product.sku", { id: product.id.toString().padStart(3, "0") })}
                    </p>
                </div>
            </div>

            {related.length > 0 ? (
                <div className="mt-16">
                    <h2 className="font-display text-3xl uppercase text-primary">{t("product.completeRotation")}</h2>
                    <div className="mt-6 grid grid-cols-2 gap-6 sm:w-1/2">
                        {related.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
