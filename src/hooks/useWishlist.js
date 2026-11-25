import { useContext } from "react";
import { WishlistContext } from "../context/wishlistContext";

export function useWishlist() {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }

    const { ids, toggle } = context;

    return {
        ids,
        isWishlisted: (productId) => ids.includes(productId),
        toggle,
    };
}
