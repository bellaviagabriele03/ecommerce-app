import { describe, expect, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartProvider } from "./CartContext";
import { useCart } from "../hooks/useCart";

const product = {
    id: 1,
    slug: "nova-runner-26",
    name: "Nova Runner '26",
    price: 139.99,
    image: "nova-runner.jpg",
};

function TestShop() {
    const { items, count, addItem } = useCart();

    return (
        <div>
            <button onClick={() => addItem(product, "42")}>Add to bag</button>
            <p data-testid="count">{count}</p>
            <ul>
                {items.map((item) => (
                    <li key={`${item.id}-${item.size}`}>
                        {item.name} — size {item.size} × {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
}

describe("add to cart integration", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    it("shows the product in the cart after adding it", () => {
        render(
            <CartProvider>
                <TestShop />
            </CartProvider>
        );

        expect(screen.queryByText(/Nova Runner/)).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Add to bag"));

        expect(screen.getByText("Nova Runner '26 — size 42 × 1")).toBeInTheDocument();
        expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    it("increases the quantity when the same product and size is added again", () => {
        render(
            <CartProvider>
                <TestShop />
            </CartProvider>
        );

        fireEvent.click(screen.getByText("Add to bag"));
        fireEvent.click(screen.getByText("Add to bag"));

        expect(screen.getByText("Nova Runner '26 — size 42 × 2")).toBeInTheDocument();
        expect(screen.getByTestId("count")).toHaveTextContent("2");
    });
});
