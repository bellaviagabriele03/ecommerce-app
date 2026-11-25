import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLocale } from "../../hooks/useLocale";
import FormField from "../../components/FormField";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Register() {
    const { t } = useLocale();
    useDocumentTitle(t("account.createAccount"));
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError(null);

        if (password.length < 8 || !/\d/.test(password)) {
            setError(t("account.passwordTooShort"));
            return;
        }
        if (!agreed) {
            setError(t("account.mustAgree"));
            return;
        }

        setSubmitting(true);
        try {
            await signUp(email, password, firstName, lastName);
            navigate("/account/orders");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-sm px-6 py-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-action">{t("account.communityLabel")}</p>
            <h1 className="mt-2 font-display text-4xl uppercase text-primary">{t("account.registerHeadline")}</h1>
            <p className="mt-2 text-secondary">
                {t("account.registerSubcopy")}
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                    <FormField label={t("checkout.firstName")} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    <FormField label={t("checkout.lastName")} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <FormField label={t("account.email")} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <FormField
                    label={t("account.password")}
                    type="password"
                    placeholder={t("account.createPassword")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <p className="-mt-3 text-xs text-secondary">{t("account.passwordHint")}</p>

                <label className="flex items-start gap-2 text-sm text-secondary">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 accent-action"
                    />
                    {t("account.agreeTerms")}
                </label>

                {error ? <p className="text-sm text-error">{error}</p> : null}

                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:opacity-60"
                >
                    {submitting ? t("account.creatingAccount") : t("account.createAccount")} <ArrowRight className="h-4 w-4" />
                </button>
            </form>

            <p className="mt-6 text-sm text-secondary">
                {t("account.alreadyHaveAccount")}{" "}
                <Link to="/account/login" className="font-semibold text-action hover:underline">
                    {t("account.logIn")}
                </Link>
            </p>
            <Link to="/catalog" className="mt-4 inline-block text-sm text-secondary hover:text-primary">
                {t("account.backToStore")}
            </Link>
        </div>
    );
}
