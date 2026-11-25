import { useLocalStorage } from "../hooks/useLocalStorage";
import { WishlistContext } from "./wishlistContext";

export function WishlistProvider({ children }) {
    const [ids, setIds] = useLocalStorage("shopnova_wishlist", []);

    function toggle(productId) {
        setIds((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
    }

    return (
        <WishlistContext.Provider value={{ ids, toggle }}>{children}</WishlistContext.Provider>
    );
}
