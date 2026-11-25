import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { Check } from "lucide-react";
import { useCart } from "../../hooks/useCart";

const STEPS = [
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
    { key: "review", label: "Review" },
];

export default function CheckoutLayout() {
    const { items } = useCart();
    const location = useLocation();
    const [shipping, setShipping] = useState(null);
    const [payment, setPayment] = useState(null);

    if (items.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    const currentStep = STEPS.findIndex((step) => location.pathname.endsWith(step.key));

    return (
        <div className="mx-auto max-w-xl px-6 py-8">
            <h1 className="font-display text-5xl uppercase text-primary">Checkout</h1>

            <div className="mt-6 flex items-center gap-4">
                {STEPS.map((step, index) => {
                    const done = index < currentStep;
                    const active = index === currentStep;
                    return (
                        <div key={step.key} className="flex items-center gap-2">
                            <span
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                    done || active ? "bg-action text-primary" : "bg-surface text-secondary"
                                }`}
                            >
                                {done ? <Check className="h-3 w-3" /> : index + 1}
                            </span>
                            <span className={active ? "text-primary" : "text-secondary"}>{step.label}</span>
                        </div>
                    );
                })}
            </div>

            <hr className="my-6 border-surface" />

            <Outlet context={{ shipping, setShipping, payment, setPayment }} />
        </div>
    );
}
