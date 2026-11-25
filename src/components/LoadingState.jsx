import { useLocale } from "../hooks/useLocale";

export default function LoadingState({ label }) {
    const { t } = useLocale();

    return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-secondary">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-action" />
            <p className="text-sm">{label ?? t("common.loading")}</p>
        </div>
    );
}
