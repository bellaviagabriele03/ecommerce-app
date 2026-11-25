import { useContext, useMemo } from "react";
import { CartContext } from "../context/cartReducer";

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }

    const { items, dispatch } = context;

    return useMemo(
        () => ({
            items,
            count: items.reduce((total, item) => total + item.quantity, 0),
            subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
            addItem: (product, size, quantity = 1) =>
                dispatch({ type: "ADD_ITEM", payload: { product, size, quantity } }),
            removeItem: (id, size) => dispatch({ type: "REMOVE_ITEM", payload: { id, size } }),
            increaseQty: (id, size) => dispatch({ type: "INCREASE_QTY", payload: { id, size } }),
            decreaseQty: (id, size) => dispatch({ type: "DECREASE_QTY", payload: { id, size } }),
            clearCart: () => dispatch({ type: "CLEAR_CART" }),
        }),
        [items, dispatch]
    );
}
