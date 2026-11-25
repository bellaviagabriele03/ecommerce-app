import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useNavigate, useOutletContext } from "react-router";
import { CreditCard } from "lucide-react";
import FormField from "../../components/FormField";

const paymentSchema = z.object({
    cardName: z.string().min(1, "Required"),
    cardNumber: z
        .string()
        .regex(/^(\d{4} ?){3}\d{4}$/, "Enter a valid 16-digit card number."),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format."),
    cvv: z.string().regex(/^\d{3,4}$/, "Enter a valid security code."),
});

export default function Payment() {
    const navigate = useNavigate();
    const { shipping, payment, setPayment } = useOutletContext();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: payment ?? {},
    });

    if (!shipping) {
        return <Navigate to="/checkout/shipping" replace />;
    }

    function onSubmit(data) {
        setPayment(data);
        navigate("/checkout/review");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="font-display text-2xl uppercase text-primary">Payment details</h2>

            <div className="bg-surface p-4 text-sm">
                <div className="flex items-center justify-between">
                    <p className="font-medium text-primary">Ship to</p>
                    <button type="button" onClick={() => navigate("/checkout/shipping")} className="text-action hover:underline">
                        Edit
                    </button>
                </div>
                <p className="mt-2 text-secondary">
                    {shipping.firstName} {shipping.lastName} &middot; {shipping.email}
                    <br />
                    {shipping.street}{shipping.apartment ? `, ${shipping.apartment}` : ""}
                    <br />
                    {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}
                </p>
            </div>

            <div className="flex items-center gap-2 border border-action px-4 py-3 text-sm text-primary">
                <CreditCard className="h-4 w-4" />
                Credit or debit card
            </div>

            <FormField label="Cardholder name" error={errors.cardName?.message} {...register("cardName")} />
            <FormField
                label="Card number"
                placeholder="4242 4242 4242 4242"
                error={errors.cardNumber?.message}
                {...register("cardNumber")}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField label="Expiry date" placeholder="MM/YY" error={errors.expiry?.message} {...register("expiry")} />
                <FormField label="Security code" placeholder="123" error={errors.cvv?.message} {...register("cvv")} />
            </div>

            <p className="text-xs text-secondary">
                This is a portfolio demo &mdash; no real payment is processed. Use any values (e.g. 4242 4242 4242 4242).
            </p>

            <button
                type="submit"
                className="w-full bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
            >
                Review order
            </button>
        </form>
    );
}
