import { useContext } from "react";
import { LocaleContext } from "../context/localeContext";
import { translations } from "../i18n/translations";

function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function useLocale() {
    const context = useContext(LocaleContext);

    if (!context) {
        throw new Error("useLocale must be used within a LocaleProvider");
    }

    const { locale, setLocale } = context;

    function t(key, vars) {
        let value = getPath(translations[locale], key) ?? getPath(translations.en, key) ?? key;

        if (vars) {
            for (const [name, replacement] of Object.entries(vars)) {
                value = value.replaceAll(`{${name}}`, replacement);
            }
        }

        return value;
    }

    const country = locale === "it" ? "Italy" : "United States";

    return { locale, setLocale, t, country };
}
