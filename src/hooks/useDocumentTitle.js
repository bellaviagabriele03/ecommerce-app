import { useEffect } from "react";

export function useDocumentTitle(title) {
    useEffect(() => {
        const previous = document.title;
        document.title = title ? `${title} · ShopNova` : "ShopNova";
        return () => {
            document.title = previous;
        };
    }, [title]);
}
