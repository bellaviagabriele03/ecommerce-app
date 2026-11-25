import { useState } from "react";
import { Link } from "react-router";
import { CreditCard, MapPin } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLocale } from "../../hooks/useLocale";
import FormField from "../../components/FormField";
import Avatar from "../../components/Avatar";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Profile() {
    const { t } = useLocale();
    useDocumentTitle(t("account.profile"));
    const { user, updateProfile, signOut } = useAuth();
    const meta = user.user_metadata ?? {};
    const [firstName, setFirstName] = useState(meta.first_name ?? "");
    const [lastName, setLastName] = useState(meta.last_name ?? "");
    const [status, setStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const address = meta.shipping_address;
    const payment = meta.payment_method;
    const countryLabel = address?.country === "Italy" ? t("common.italy") : t("common.unitedStates");

    async function onSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);
        try {
            await updateProfile({ first_name: firstName, last_name: lastName });
            setStatus({ type: "success", message: t("account.profileUpdated") });
        } catch (err) {
            setStatus({ type: "error", message: err.message });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-xl px-6 py-12">
            <div className="flex items-center gap-4">
                <Avatar firstName={meta.first_name} lastName={meta.last_name} email={user.email} />
                <div className="min-w-0">
                    <h1 className="font-display text-4xl uppercase text-primary">{t("account.profile")}</h1>
                    <p className="truncate text-sm text-secondary">{user.email}</p>
                </div>
            </div>

            <section className="mt-10">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-secondary">{t("account.personalInfo")}</h2>
                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label={t("checkout.firstName")} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <FormField label={t("checkout.lastName")} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <FormField label={t("account.emailAddress")} value={user.email} disabled className="opacity-60" />

                    {status ? (
                        <p className={`text-sm ${status.type === "error" ? "text-error" : "text-action"}`}>{status.message}</p>
                    ) : null}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-action py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:opacity-60"
                    >
                        {submitting ? t("account.saving") : t("account.saveChanges")}
                    </button>
                </form>
            </section>

            <section className="mt-10 grid gap-4 sm:grid-cols-2">
                <div className="bg-surface p-4 text-sm">
                    <p className="flex items-center gap-2 font-medium text-primary">
                        <MapPin className="h-4 w-4 text-action" /> {t("account.shippingAddressTitle")}
                    </p>
                    {address ? (
                        <p className="mt-2 text-secondary">
                            {address.firstName} {address.lastName}
                            <br />
                            {address.street}{address.apartment ? `, ${address.apartment}` : ""}
                            <br />
                            {address.city}, {address.state} {address.zip}
                            <br />
                            {countryLabel}
                            {address.phone ? <><br />{address.phone}</> : null}
                        </p>
                    ) : (
                        <p className="mt-2 text-secondary">{t("account.noSavedAddress")}</p>
                    )}
                </div>

                <div className="bg-surface p-4 text-sm">
                    <p className="flex items-center gap-2 font-medium text-primary">
                        <CreditCard className="h-4 w-4 text-action" /> {t("account.paymentMethodTitle")}
                    </p>
                    {payment ? (
                        <p className="mt-2 text-secondary">
                            {t("account.cardEndingShort", { brand: payment.brand, last4: payment.last4, expiry: payment.expiry })}
                        </p>
                    ) : (
                        <p className="mt-2 text-secondary">{t("account.noSavedPayment")}</p>
                    )}
                </div>
            </section>

            <div className="mt-8 flex items-center justify-between border-t border-surface pt-6 text-sm">
                <Link to="/account/orders" className="text-secondary hover:text-primary">
                    {t("account.viewMyOrders")}
                </Link>
                <button onClick={signOut} className="text-secondary underline hover:text-primary">
                    {t("account.logOut")}
                </button>
            </div>
        </div>
    );
}
