import { Link } from "react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/formatPrice";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const FREE_SHIPPING_THRESHOLD = 150;
const FLAT_SHIPPING = 9.95;
const TAX_RATE = 0.08;

export default function Cart() {
    useDocumentTitle("Your bag");
    const { items, count, subtotal, removeItem, increaseQty, decreaseQty } = useCart();

    if (items.length === 0) {
        return (
            <div className="px-6 py-8">
                <p className="text-sm text-secondary">
                    <Link to="/catalog" className="hover:text-primary">← Continue shopping</Link>
                </p>

                <div className="mt-16 flex flex-col items-center gap-4 text-center">
                    <p className="text-sm text-secondary">0 items</p>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-surface">
                        <ShoppingBag className="h-8 w-8 text-secondary" />
                    </div>
                    <h1 className="font-display text-4xl uppercase text-primary">Room for something good.</h1>
                    <p className="max-w-sm text-secondary">
                        Your bag is empty. Find your next everyday pair or a heavyweight essential.
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

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    return (
        <div className="px-6 py-8">
            <p className="text-sm text-secondary">
                <Link to="/catalog" className="hover:text-primary">← Continue shopping</Link>
            </p>

            <div className="mt-4 flex items-end justify-between">
                <h1 className="font-display text-5xl uppercase text-primary">Your bag</h1>
                <p className="text-sm text-secondary">{count} items</p>
            </div>

            <div className="mt-8 bg-surface p-4">
                {remainingForFreeShipping === 0 ? (
                    <p className="text-sm text-primary">✓ You unlocked free shipping.</p>
                ) : (
                    <p className="text-sm text-secondary">
                        Add {formatPrice(remainingForFreeShipping)} more for free shipping.
                    </p>
                )}
                <div className="mt-3 h-1 w-full bg-canvas">
                    <div
                        className="h-1 bg-action transition-all"
                        style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                    />
                </div>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
                <ul className="divide-y divide-surface">
                    {items.map((item) => (
                        <li key={`${item.id}-${item.size}`} className="flex gap-4 py-6">
                            <Link to={`/catalog/${item.slug}`} className="h-24 w-24 shrink-0 overflow-hidden bg-surface">
                                <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                            </Link>
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <Link to={`/catalog/${item.slug}`} className="font-medium text-primary hover:text-action">
                                            {item.name}
                                        </Link>
                                        <p className="text-sm text-secondary">Size {item.size}</p>
                                    </div>
                                    <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center border border-surface">
                                        <button
                                            onClick={() => decreaseQty(item.id, item.size)}
                                            className="px-3 py-1 text-primary hover:text-action"
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <span className="px-3 text-sm text-primary">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQty(item.id, item.size)}
                                            className="px-3 py-1 text-primary hover:text-action"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id, item.size)}
                                        className="text-sm text-secondary underline hover:text-primary"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="h-fit space-y-6 bg-surface p-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Promo code"
                            className="search-bar flex-1 px-3 py-2 text-sm text-primary placeholder-secondary outline-none focus:ring-1 focus:ring-action"
                        />
                        <button className="border border-secondary px-4 text-sm font-semibold uppercase text-primary hover:border-primary">
                            Apply
                        </button>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-secondary">
                            <span>Subtotal ({count} items)</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-secondary">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                        </div>
                        <div className="flex justify-between text-secondary">
                            <span>Estimated tax (8%)</span>
                            <span>{formatPrice(tax)}</span>
                        </div>
                    </div>

                    <div className="flex justify-between border-t border-canvas pt-4 font-semibold text-primary">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    <Link
                        to="/checkout"
                        className="block bg-action py-4 text-center text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
                    >
                        Checkout — {formatPrice(total)}
                    </Link>
                    <p className="text-center text-xs text-secondary">
                        Secure checkout · Encrypted payments
                    </p>
                </div>
            </div>
        </div>
    );
}
