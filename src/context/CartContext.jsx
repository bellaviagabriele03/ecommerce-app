import { useEffect, useReducer } from "react";
import { CartContext, cartReducer } from "./cartReducer";

const STORAGE_KEY = "shopnova_cart";

function loadInitialCart() {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore write errors (e.g. storage full or disabled)
        }
    }, [items]);

    return <CartContext.Provider value={{ items, dispatch }}>{children}</CartContext.Provider>;
}
