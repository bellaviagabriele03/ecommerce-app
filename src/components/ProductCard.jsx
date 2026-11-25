import { Link } from "react-router";
import { formatPrice } from "../utils/formatPrice";

const CATEGORY_LABELS = {
    sneakers: "Sneakers",
    hoodie: "Hoodie",
    tshirt: "T-Shirt",
    cap: "Cap",
    accessory: "Accessory",
};

export default function ProductCard({ product }) {
    const { slug, name, price, category, image, isNew, inStock } = product;

    return (
        <Link to={`/catalog/${slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden bg-surface">
                {!inStock ? (
                    <span className="absolute left-3 top-3 bg-error px-2 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                        Sold out
                    </span>
                ) : isNew ? (
                    <span className="absolute left-3 top-3 bg-newdrop px-2 py-1 text-xs font-bold uppercase tracking-wide text-canvas">
                        New drop
                    </span>
                ) : null}
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="mt-3 space-y-1">
                <h3 className="font-medium text-primary">{name}</h3>
                <p className="text-sm text-secondary">{CATEGORY_LABELS[category] ?? category}</p>
                <p className="font-semibold text-primary">{formatPrice(price)}</p>
            </div>
        </Link>
    );
}
