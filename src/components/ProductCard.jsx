import { Link } from "react-router";
import { Heart } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import { useWishlist } from "../hooks/useWishlist";
import { useToast } from "../hooks/useToast";
import { useLocale } from "../hooks/useLocale";

export default function ProductCard({ product }) {
    const { id, slug, name, price, category, image, isNew, inStock } = product;
    const { isWishlisted, toggle } = useWishlist();
    const { addToast } = useToast();
    const { t, locale } = useLocale();
    const wishlisted = isWishlisted(id);

    return (
        <Link to={`/catalog/${slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden bg-surface">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggle(id);
                        if (!wishlisted) {
                            addToast({
                                title: t("toast.addedToWishlist"),
                                message: name,
                                actionTo: "/wishlist",
                                actionLabel: t("toast.viewWishlist"),
                            });
                        }
                    }}
                    aria-label={wishlisted ? t("common.removeFromWishlist") : t("common.addToWishlist")}
                    className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-canvas/70 text-primary transition-colors hover:bg-canvas"
                >
                    <Heart className={`h-4 w-4 ${wishlisted ? "fill-action text-action" : ""}`} />
                </button>
                {!inStock ? (
                    <span className="absolute left-3 top-3 bg-error px-2 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                        {t("product.soldOut")}
                    </span>
                ) : isNew ? (
                    <span className="absolute left-3 top-3 bg-newdrop px-2 py-1 text-xs font-bold uppercase tracking-wide text-canvas">
                        {t("product.newDrop")}
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
                <p className="text-sm text-secondary">{t(`category.${category}`)}</p>
                <p className="font-semibold text-primary">{formatPrice(price, locale)}</p>
            </div>
        </Link>
    );
}
