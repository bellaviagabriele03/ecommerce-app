import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate, useOutletContext } from "react-router";
import { CreditCard } from "lucide-react";
import FormField from "../../components/FormField";
import { useLocale } from "../../hooks/useLocale";
import { getPaymentSchema } from "./checkoutSchemas";

export default function Payment() {
    const navigate = useNavigate();
    const { shipping, payment, setPayment } = useOutletContext();
    const { t } = useLocale();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(getPaymentSchema(t)),
        defaultValues: payment ?? {},
    });

    if (!shipping) {
        return <Navigate to="/checkout/shipping" replace />;
    }

    const countryLabel = shipping.country === "Italy" ? t("common.italy") : t("common.unitedStates");

    function onSubmit(data) {
        setPayment(data);
        navigate("/checkout/review");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="font-display text-2xl uppercase text-primary">{t("checkout.paymentDetails")}</h2>

            <div className="bg-surface p-4 text-sm">
                <div className="flex items-center justify-between">
                    <p className="font-medium text-primary">{t("checkout.shipTo")}</p>
                    <button type="button" onClick={() => navigate("/checkout/shipping")} className="text-action hover:underline">
                        {t("checkout.edit")}
                    </button>
                </div>
                <p className="mt-2 text-secondary">
                    {shipping.firstName} {shipping.lastName} &middot; {shipping.email}
                    <br />
                    {shipping.street}{shipping.apartment ? `, ${shipping.apartment}` : ""}
                    <br />
                    {shipping.city}, {shipping.state} {shipping.zip}, {countryLabel}
                </p>
            </div>

            <div className="flex items-center gap-2 border border-action px-4 py-3 text-sm text-primary">
                <CreditCard className="h-4 w-4" />
                {t("checkout.creditCard")}
            </div>

            <FormField label={t("checkout.cardholderName")} error={errors.cardName?.message} {...register("cardName")} />
            <FormField
                label={t("checkout.cardNumber")}
                placeholder="4242 4242 4242 4242"
                error={errors.cardNumber?.message}
                {...register("cardNumber")}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField label={t("checkout.expiryDate")} placeholder="MM/YY" error={errors.expiry?.message} {...register("expiry")} />
                <FormField label={t("checkout.securityCode")} placeholder="123" error={errors.cvv?.message} {...register("cvv")} />
            </div>

            <p className="text-xs text-secondary">
                {t("checkout.demoNotice")}
            </p>

            <button
                type="submit"
                className="w-full bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
            >
                {t("checkout.reviewOrder")}
            </button>
        </form>
    );
}
