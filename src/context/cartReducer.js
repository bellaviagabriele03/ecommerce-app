import { createContext } from "react";

export const CartContext = createContext(null);

function sameLine(item, id, size) {
    return item.id === id && item.size === size;
}

export function cartReducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM": {
            const { product, size, quantity = 1 } = action.payload;
            const existing = state.find((item) => sameLine(item, product.id, size));

            if (existing) {
                return state.map((item) =>
                    sameLine(item, product.id, size)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [
                ...state,
                {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    size,
                    quantity,
                },
            ];
        }

        case "REMOVE_ITEM":
            return state.filter((item) => !sameLine(item, action.payload.id, action.payload.size));

        case "INCREASE_QTY":
            return state.map((item) =>
                sameLine(item, action.payload.id, action.payload.size)
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

        case "DECREASE_QTY":
            return state
                .map((item) =>
                    sameLine(item, action.payload.id, action.payload.size)
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0);

        case "CLEAR_CART":
            return [];

        default:
            return state;
    }
}
