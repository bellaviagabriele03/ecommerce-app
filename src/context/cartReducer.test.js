import { describe, expect, it } from "vitest";
import { cartReducer } from "./cartReducer";

const product = { id: 1, slug: "nova-runner-26", name: "Nova Runner '26", price: 139.99, image: "x.jpg" };
const otherProduct = { id: 2, slug: "flux-low", name: "Flux Low", price: 99.99, image: "y.jpg" };

describe("cartReducer", () => {
    it("adds a new item", () => {
        const state = cartReducer([], {
            type: "ADD_ITEM",
            payload: { product, size: "42" },
        });

        expect(state).toHaveLength(1);
        expect(state[0]).toMatchObject({ id: 1, size: "42", quantity: 1 });
    });

    it("increases quantity when adding the same product and size again", () => {
        let state = cartReducer([], { type: "ADD_ITEM", payload: { product, size: "42" } });
        state = cartReducer(state, { type: "ADD_ITEM", payload: { product, size: "42" } });

        expect(state).toHaveLength(1);
        expect(state[0].quantity).toBe(2);
    });

    it("treats the same product in a different size as a separate line", () => {
        let state = cartReducer([], { type: "ADD_ITEM", payload: { product, size: "42" } });
        state = cartReducer(state, { type: "ADD_ITEM", payload: { product, size: "43" } });

        expect(state).toHaveLength(2);
    });

    it("increases and decreases quantity", () => {
        let state = cartReducer([], { type: "ADD_ITEM", payload: { product, size: "42" } });
        state = cartReducer(state, { type: "INCREASE_QTY", payload: { id: 1, size: "42" } });
        expect(state[0].quantity).toBe(2);

        state = cartReducer(state, { type: "DECREASE_QTY", payload: { id: 1, size: "42" } });
        expect(state[0].quantity).toBe(1);
    });

    it("removes the line when quantity drops to 0", () => {
        let state = cartReducer([], { type: "ADD_ITEM", payload: { product, size: "42" } });
        state = cartReducer(state, { type: "DECREASE_QTY", payload: { id: 1, size: "42" } });

        expect(state).toHaveLength(0);
    });

    it("removes an item", () => {
        let state = cartReducer([], { type: "ADD_ITEM", payload: { product, size: "42" } });
        state = cartReducer(state, { type: "ADD_ITEM", payload: { product: otherProduct, size: "40" } });
        state = cartReducer(state, { type: "REMOVE_ITEM", payload: { id: 1, size: "42" } });

        expect(state).toHaveLength(1);
        expect(state[0].id).toBe(2);
    });

    it("clears the cart", () => {
        let state = cartReducer([], { type: "ADD_ITEM", payload: { product, size: "42" } });
        state = cartReducer(state, { type: "CLEAR_CART" });

        expect(state).toEqual([]);
    });

    it("ignores unknown actions", () => {
        const state = cartReducer([], { type: "NOOP" });
        expect(state).toEqual([]);
    });
});
