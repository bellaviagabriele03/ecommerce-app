import { useLocalStorage } from "../hooks/useLocalStorage";
import { LocaleContext } from "./localeContext";

export function LocaleProvider({ children }) {
    const [locale, setLocale] = useLocalStorage("shopnova_locale", "en");

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
    );
}
