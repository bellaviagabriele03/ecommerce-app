import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLocale } from "../../hooks/useLocale";
import FormField from "../../components/FormField";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Login() {
    const { t } = useLocale();
    useDocumentTitle(t("account.logIn"));
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await signIn(email, password);
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
            <h1 className="mt-2 font-display text-4xl uppercase text-primary">{t("account.loginHeadline")}</h1>
            <p className="mt-2 text-secondary">
                {t("account.loginSubcopy")}
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4 text-left">
                <FormField label={t("account.email")} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <FormField label={t("account.password")} type="password" placeholder={t("account.password")} value={password} onChange={(e) => setPassword(e.target.value)} required />

                {error ? <p className="text-sm text-error">{error}</p> : null}

                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:opacity-60"
                >
                    {submitting ? t("account.loggingIn") : t("account.logIn")} <ArrowRight className="h-4 w-4" />
                </button>
            </form>

            <p className="mt-6 text-sm text-secondary">
                {t("account.newToShopnova")}{" "}
                <Link to="/account/register" className="font-semibold text-action hover:underline">
                    {t("account.createAccount")}
                </Link>
            </p>
            <Link to="/catalog" className="mt-4 inline-block text-sm text-secondary hover:text-primary">
                {t("account.backToStore")}
            </Link>
        </div>
    );
}
