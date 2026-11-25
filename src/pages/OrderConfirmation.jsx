import { Navigate, Link, useLocation } from "react-router";
import { CheckCircle2, Package } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

function estimateDeliveryRange() {
    const start = new Date();
    start.setDate(start.getDate() + 4);
    const end = new Date();
    end.setDate(end.getDate() + 7);
    const options = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", options)} – ${end.toLocaleDateString("en-US", options)}`;
}

export default function OrderConfirmation() {
    const { state } = useLocation();
    const order = state?.order;

    if (!order) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="mx-auto max-w-xl px-6 py-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-action" />
            <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-action">
                Order confirmed / #{order.number}
            </p>
            <h1 className="mt-2 font-display text-4xl uppercase text-primary">Good taste. Great choice.</h1>
            <p className="mt-4 text-secondary">
                Thanks, {order.shipping.firstName}. Your next rotation is on its way. We sent your receipt to{" "}
                {order.shipping.email}.
            </p>

            <div className="mt-8 bg-surface p-4 text-left text-sm">
                <div className="flex items-start gap-3">
                    <Package className="mt-0.5 h-5 w-5 shrink-0 text-action" />
                    <div>
                        <p className="font-medium text-primary">Estimated delivery: {estimateDeliveryRange()}</p>
                        <p className="text-secondary">Standard shipping &middot; Tracking sent when shipped</p>
                    </div>
                </div>
                <hr className="my-4 border-canvas" />
                <p className="text-secondary">
                    {order.shipping.firstName} {order.shipping.lastName}
                    <br />
                    {order.shipping.street}{order.shipping.apartment ? `, ${order.shipping.apartment}` : ""}
                    <br />
                    {order.shipping.city}, {order.shipping.state} {order.shipping.zip}, {order.shipping.country}
                </p>
            </div>

            <h2 className="mt-8 text-left font-display text-2xl uppercase text-primary">Your new rotation</h2>
            <ul className="mt-4 divide-y divide-surface text-left">
                {order.items.map((item) => (
                    <li key={`${item.id}-${item.size}`} className="flex gap-4 py-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden bg-surface">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-primary">{item.name}</p>
                            <p className="text-sm text-secondary">Size {item.size}</p>
                            <p className="text-sm font-semibold text-primary">{formatPrice(item.price)}</p>
                        </div>
                        <p className="text-sm text-secondary">Qty {item.quantity}</p>
                    </li>
                ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-surface pt-4 text-left text-sm text-secondary">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Estimated tax</span>
                    <span>{formatPrice(order.tax)}</span>
                </div>
            </div>
            <div className="flex justify-between border-t border-surface pt-4 text-left font-semibold text-primary">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
            </div>
            <p className="mt-2 text-left text-xs text-secondary">
                Paid with card ending in {order.cardLast4} &middot; {formatPrice(order.total)}
            </p>

            <Link
                to="/catalog"
                className="mt-8 inline-block bg-action px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
            >
                Keep exploring
            </Link>
            <p className="mt-4 text-xs text-secondary">Need a hand? hello@shopnova.store</p>
        </div>
    );
}
