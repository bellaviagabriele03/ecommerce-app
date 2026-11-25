import { useLocalStorage } from "../hooks/useLocalStorage";
import { CartContext, cartReducer } from "./cartReducer";

export function CartProvider({ children }) {
    const [items, setItems] = useLocalStorage("shopnova_cart", []);
    const dispatch = (action) => setItems((prev) => cartReducer(prev, action));

    return <CartContext.Provider value={{ items, dispatch }}>{children}</CartContext.Provider>;
}
