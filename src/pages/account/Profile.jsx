import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import FormField from "../../components/FormField";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function Profile() {
    useDocumentTitle("Profile");
    const { user, updateProfile, signOut } = useAuth();
    const [fullName, setFullName] = useState(user.user_metadata?.full_name ?? "");
    const [status, setStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);
        try {
            await updateProfile(fullName);
            setStatus({ type: "success", message: "Profile updated." });
        } catch (err) {
            setStatus({ type: "error", message: err.message });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-sm px-6 py-12">
            <h1 className="font-display text-4xl uppercase text-primary">Profile</h1>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <FormField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <FormField label="Email address" value={user.email} disabled className="opacity-60" />

                {status ? (
                    <p className={`text-sm ${status.type === "error" ? "text-error" : "text-action"}`}>{status.message}</p>
                ) : null}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-action py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover disabled:opacity-60"
                >
                    {submitting ? "Saving..." : "Save changes"}
                </button>
            </form>

            <div className="mt-8 flex items-center justify-between border-t border-surface pt-6 text-sm">
                <Link to="/account/orders" className="text-secondary hover:text-primary">
                    View my orders
                </Link>
                <button onClick={signOut} className="text-secondary underline hover:text-primary">
                    Log out
                </button>
            </div>
        </div>
    );
}
