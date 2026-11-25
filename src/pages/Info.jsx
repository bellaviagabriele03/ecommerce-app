import { useLocale } from "../hooks/useLocale";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function Info({ pageKey }) {
    const { t } = useLocale();
    const title = t(`info.${pageKey}Title`);
    useDocumentTitle(title);

    return (
        <div className="mx-auto max-w-2xl px-6 py-16">
            <h1 className="font-display text-4xl uppercase text-primary">{title}</h1>
            <div className="mt-4 space-y-4 text-secondary">
                <p>{t(`info.${pageKey}Body`)}</p>
            </div>
        </div>
    );
}
