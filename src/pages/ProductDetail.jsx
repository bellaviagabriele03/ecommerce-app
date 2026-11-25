import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProductBySlug, getProducts } from "../services/api";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import ErrorState from "../components/ErrorState";
import ProductCard from "../components/ProductCard";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const CATEGORY_LABELS = {
    sneakers: "Sneakers",
    hoodie: "Hoodie",
    tshirt: "T-Shirt",
    cap: "Cap",
    accessory: "Accessory",
};

export default function ProductDetail() {
    const { slug } = useParams();
    return <ProductDetailView key={slug} slug={slug} />;
}

function ProductDetailView({ slug }) {
    const { addItem } = useCart();
    const { addToast } = useToast();
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
                title="Product not found."
                message="This piece may have sold out of our records. Head back to the catalog."
            />
        );
    }

    if (!product) {
        return <ProductDetailSkeleton />;
    }

    const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
    const effectiveSize = selectedSize ?? product.sizes[0];

    return (
        <div className="px-6 py-8">
            <p className="text-sm text-secondary">
                <Link to="/" className="hover:text-primary">Home</Link> /{" "}
                <Link to={`/catalog?category=${product.category}`} className="hover:text-primary">{categoryLabel}</Link> /{" "}
                {product.name}
            </p>

            <div className="mt-6 grid gap-10 lg:grid-cols-2">
                <div className="relative aspect-square overflow-hidden bg-surface">
                    {!product.inStock ? (
                        <span className="absolute left-3 top-3 bg-error px-2 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                            Sold out
                        </span>
                    ) : product.isNew ? (
                        <span className="absolute left-3 top-3 bg-newdrop px-2 py-1 text-xs font-bold uppercase tracking-wide text-canvas">
                            New drop
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
                        <p className="text-xl font-semibold text-primary">{formatPrice(product.price)}</p>
                        <p className="text-sm text-secondary">
                            {product.inStock ? "In stock · Ready to ship" : "Out of stock"}
                        </p>
                    </div>

                    <hr className="my-6 border-surface" />

                    <p className="text-sm font-medium text-primary">Select size</p>
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
                                {size}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={!product.inStock}
                        onClick={() => {
                            addItem(product, effectiveSize);
                            addToast({
                                title: "Added to your bag",
                                message: `${product.name} · ${categoryLabel} · ${effectiveSize}`,
                                actionTo: "/cart",
                                actionLabel: "View bag →",
                            });
                        }}
                        className="mt-6 w-full bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:bg-surface disabled:text-secondary"
                    >
                        {product.inStock
                            ? `Add to bag — ${formatPrice(product.price)}`
                            : "Sold out"}
                    </button>

                    <hr className="my-6 border-surface" />

                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">Built for your daily rotation</p>
                    <p className="mt-2 text-sm text-secondary">{product.description}</p>
                    <p className="mt-4 text-xs text-secondary">
                        SKU: SN-{product.id.toString().padStart(3, "0")} · Easy 14-day returns
                    </p>
                </div>
            </div>

            {related.length > 0 ? (
                <div className="mt-16">
                    <h2 className="font-display text-3xl uppercase text-primary">Complete the rotation</h2>
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
