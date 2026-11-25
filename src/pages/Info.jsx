import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Info({ title, children }) {
    useDocumentTitle(title);
    return (
        <div className="mx-auto max-w-2xl px-6 py-16">
            <h1 className="font-display text-4xl uppercase text-primary">{title}</h1>
            <div className="mt-4 space-y-4 text-secondary">{children}</div>
        </div>
    );
}
