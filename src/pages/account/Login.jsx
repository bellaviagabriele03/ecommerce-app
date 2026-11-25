import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import FormField from "../../components/FormField";

export default function Login() {
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
            <p className="text-sm font-semibold uppercase tracking-wide text-action">The ShopNova community</p>
            <h1 className="mt-2 font-display text-4xl uppercase text-primary">Welcome back.</h1>
            <p className="mt-2 text-secondary">
                Your rotation is waiting. Log in to track orders and get back to what's next.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4 text-left">
                <FormField label="Email address" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <FormField label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                {error ? <p className="text-sm text-error">{error}</p> : null}

                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:opacity-60"
                >
                    {submitting ? "Logging in..." : "Log in"} <ArrowRight className="h-4 w-4" />
                </button>
            </form>

            <p className="mt-6 text-sm text-secondary">
                New to ShopNova?{" "}
                <Link to="/account/register" className="font-semibold text-action hover:underline">
                    Create an account
                </Link>
            </p>
            <Link to="/catalog" className="mt-4 inline-block text-sm text-secondary hover:text-primary">
                ← Back to the store
            </Link>
        </div>
    );
}
