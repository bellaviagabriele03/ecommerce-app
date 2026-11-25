const formatters = {
    en: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    it: new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }),
};

export function formatPrice(amount, locale = "en") {
    return (formatters[locale] ?? formatters.en).format(amount);
}
