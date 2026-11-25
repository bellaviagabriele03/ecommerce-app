import { useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { discountRateFor } from "../utils/pricing";

export function usePromoCode() {
    const [appliedCode, setAppliedCode] = useLocalStorage("shopnova_promo", null);
    const [input, setInput] = useState(appliedCode ?? "");
    const [error, setError] = useState(false);

    function apply() {
        if (discountRateFor(input) > 0) {
            setAppliedCode(input.trim().toUpperCase());
            setError(false);
            return true;
        }
        setAppliedCode(null);
        setError(true);
        return false;
    }

    function clear() {
        setAppliedCode(null);
        setInput("");
    }

    return { input, setInput, appliedCode, discountRate: discountRateFor(appliedCode), error, apply, clear };
}
