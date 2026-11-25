import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useOutletContext } from "react-router";
import FormField from "../../components/FormField";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { useLocale } from "../../hooks/useLocale";
import { formatPrice } from "../../utils/formatPrice";
import { getShippingSchema } from "./checkoutSchemas";

export default function Shipping() {
    const navigate = useNavigate();
    const { shipping, setShipping } = useOutletContext();
    const { items, subtotal } = useCart();
    const { user } = useAuth();
    const { t, locale, country } = useLocale();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(getShippingSchema(t)),
        defaultValues: shipping ?? { country, email: user?.email ?? "" },
    });

    const selectedCountry = watch("country");
    const isItaly = selectedCountry === "Italy";

    function onSubmit(data) {
        setShipping(data);
        navigate("/checkout/payment");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl uppercase text-primary">{t("checkout.shippingDetails")}</h2>
                {!user ? (
                    <Link to="/account/login" className="text-sm text-action hover:underline">
                        {t("checkout.logIn")}
                    </Link>
                ) : null}
            </div>

            <FormField label={t("checkout.email")} type="email" placeholder="you@email.com" error={errors.email?.message} {...register("email")} />

            <div className="grid grid-cols-2 gap-4">
                <FormField label={t("checkout.firstName")} error={errors.firstName?.message} {...register("firstName")} />
                <FormField label={t("checkout.lastName")} error={errors.lastName?.message} {...register("lastName")} />
            </div>

            <FormField label={t("checkout.street")} error={errors.street?.message} {...register("street")} />
            <FormField label={t("checkout.apartment")} error={errors.apartment?.message} {...register("apartment")} />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    label={t("checkout.city")}
                    placeholder={isItaly ? "Milano" : undefined}
                    error={errors.city?.message}
                    {...register("city")}
                />
                <FormField
                    label={isItaly ? t("checkout.cap") : t("checkout.zip")}
                    placeholder={isItaly ? "20121" : undefined}
                    error={errors.zip?.message}
                    {...register("zip")}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField label={t("checkout.country")} as="select" error={errors.country?.message} {...register("country")}>
                    <option value="United States">{t("common.unitedStates")}</option>
                    <option value="Italy">{t("common.italy")}</option>
                </FormField>
                <FormField
                    label={isItaly ? t("checkout.province") : t("checkout.state")}
                    placeholder={isItaly ? "MI" : undefined}
                    error={errors.state?.message}
                    {...register("state")}
                />
            </div>

            <FormField label={t("checkout.phone")} type="tel" error={errors.phone?.message} {...register("phone")} />
            <p className="-mt-4 text-xs text-secondary">{t("checkout.phoneHint")}</p>

            <div>
                <p className="text-sm font-medium text-primary">{t("checkout.shippingMethod")}</p>
                <div className="mt-2 flex items-center justify-between border border-action px-4 py-3">
                    <div>
                        <p className="text-sm text-primary">{t("checkout.standardShipping")}</p>
                        <p className="text-xs text-secondary">{t("checkout.standardShippingTime")}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary">{t("cart.free")}</p>
                </div>
            </div>

            <div className="space-y-2 border-t border-surface pt-4 text-sm text-secondary">
                <div className="flex justify-between">
                    <span>{t("cart.subtotal", { count: items.length })}</span>
                    <span>{formatPrice(subtotal, locale)}</span>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
            >
                {t("checkout.continueToPayment")}
            </button>
        </form>
    );
}
