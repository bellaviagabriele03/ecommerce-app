import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import FormField from "../../components/FormField";

export default function Register() {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError(null);

        if (password.length < 8 || !/\d/.test(password)) {
            setError("Password must be at least 8 characters, including a number.");
            return;
        }
        if (!agreed) {
            setError("Please agree to the Terms of Service and Privacy Policy.");
            return;
        }

        setSubmitting(true);
        try {
            await signUp(email, password, fullName);
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
            <h1 className="mt-2 font-display text-4xl uppercase text-primary">Make it yours.</h1>
            <p className="mt-2 text-secondary">
                Create an account. Save your favorites, track your orders and stay ready for the next drop.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4 text-left">
                <FormField label="Full name" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <FormField label="Email address" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <FormField
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <p className="-mt-3 text-xs text-secondary">At least 8 characters, including a number.</p>

                <label className="flex items-start gap-2 text-sm text-secondary">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 accent-action"
                    />
                    I agree to the Terms of Service and Privacy Policy.
                </label>

                {error ? <p className="text-sm text-error">{error}</p> : null}

                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 bg-action py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:opacity-60"
                >
                    {submitting ? "Creating account..." : "Create account"} <ArrowRight className="h-4 w-4" />
                </button>
            </form>

            <p className="mt-6 text-sm text-secondary">
                Already have an account?{" "}
                <Link to="/account/login" className="font-semibold text-action hover:underline">
                    Log in
                </Link>
            </p>
            <Link to="/catalog" className="mt-4 inline-block text-sm text-secondary hover:text-primary">
                ← Back to the store
            </Link>
        </div>
    );
}
