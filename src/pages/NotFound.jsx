import { Link } from "react-router";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NotFound() {
    useDocumentTitle("Page not found");
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-action">404</p>
            <h1 className="font-display text-5xl uppercase text-primary">Wrong turn.</h1>
            <p className="max-w-md text-secondary">
                This page isn't part of the rotation. Let's get you back to something good.
            </p>
            <Link
                to="/catalog"
                className="mt-2 bg-action px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
            >
                Explore the rotation
            </Link>
        </div>
    );
}
