import { useReducer } from "react";
import { CartContext, cartReducer } from "./cartReducer";

export function CartProvider({ children }) {
    const [items, dispatch] = useReducer(cartReducer, []);

    return <CartContext.Provider value={{ items, dispatch }}>{children}</CartContext.Provider>;
}
