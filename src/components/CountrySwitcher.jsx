import { useState } from "react";
import { Globe } from "lucide-react";
import { useLocale } from "../hooks/useLocale";

const OPTIONS = [
    { locale: "en", code: "US", labelKey: "common.unitedStates" },
    { locale: "it", code: "IT", labelKey: "common.italy" },
];

export default function CountrySwitcher() {
    const { locale, setLocale, t } = useLocale();
    const [open, setOpen] = useState(false);
    const current = OPTIONS.find((o) => o.locale === locale) ?? OPTIONS[0];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label={t("common.country")}
                aria-expanded={open}
                className="flex items-center gap-1 text-primary"
            >
                <Globe className="h-5 w-5" />
                <span className="hidden text-xs font-semibold sm:inline">{current.code}</span>
            </button>

            {open ? (
                <>
                    <button
                        aria-hidden="true"
                        tabIndex={-1}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-10 cursor-default"
                    />
                    <div className="absolute right-0 z-20 mt-2 w-44 border border-surface bg-canvas py-1 text-sm shadow-lg">
                        {OPTIONS.map((option) => (
                            <button
                                key={option.locale}
                                onClick={() => {
                                    setLocale(option.locale);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors ${
                                    option.locale === locale
                                        ? "text-action"
                                        : "text-secondary hover:text-primary"
                                }`}
                            >
                                {t(option.labelKey)}
                                <span className="text-xs">{option.code}</span>
                            </button>
                        ))}
                    </div>
                </>
            ) : null}
        </div>
    );
}
