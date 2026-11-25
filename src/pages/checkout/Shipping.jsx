import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate, useOutletContext } from "react-router";
import FormField from "../../components/FormField";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { formatPrice } from "../../utils/formatPrice";

const shippingSchema = z.object({
    email: z.string().email("Enter a valid email address."),
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    street: z.string().min(1, "Required"),
    apartment: z.string().optional(),
    city: z.string().min(1, "Required"),
    zip: z.string().min(3, "Enter a valid ZIP code."),
    country: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    phone: z.string().min(7, "Enter a valid phone number."),
});

export default function Shipping() {
    const navigate = useNavigate();
    const { shipping, setShipping } = useOutletContext();
    const { items, subtotal } = useCart();
    const { user } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(shippingSchema),
        defaultValues: shipping ?? { country: "United States", email: user?.email ?? "" },
    });

    function onSubmit(data) {
        setShipping(data);
        navigate("/checkout/payment");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl uppercase text-primary">Shipping details</h2>
                {!user ? (
                    <Link to="/account/login" className="text-sm text-action hover:underline">
                        Log in
                    </Link>
                ) : null}
            </div>

            <FormField label="Email address" type="email" placeholder="you@email.com" error={errors.email?.message} {...register("email")} />

            <div className="grid grid-cols-2 gap-4">
                <FormField label="First name" error={errors.firstName?.message} {...register("firstName")} />
                <FormField label="Last name" error={errors.lastName?.message} {...register("lastName")} />
            </div>

            <FormField label="Street address" error={errors.street?.message} {...register("street")} />
            <FormField label="Apartment, suite, etc. (optional)" error={errors.apartment?.message} {...register("apartment")} />

            <div className="grid grid-cols-2 gap-4">
                <FormField label="City" error={errors.city?.message} {...register("city")} />
                <FormField label="ZIP code" error={errors.zip?.message} {...register("zip")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField label="Country" as="select" error={errors.country?.message} {...register("country")}>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                </FormField>
                <FormField label="State" error={errors.state?.message} {...register("state")} />
            </div>

            <FormField label="Phone number" type="tel" error={errors.phone?.message} {...register("phone")} />
            <p className="-mt-4 text-xs text-secondary">Only for delivery updates.</p>

            <div>
                <p className="text-sm font-medium text-primary">Shipping method</p>
                <div className="mt-2 flex items-center justify-between border border-action px-4 py-3">
                    <div>
                        <p className="text-sm text-primary">Standard shipping</p>
                        <p className="text-xs text-secondary">3-5 business days</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">FREE</p>
                </div>
            </div>

            <div className="space-y-2 border-t border-surface pt-4 text-sm text-secondary">
                <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
            >
                Continue to payment
            </button>
        </form>
    );
}
