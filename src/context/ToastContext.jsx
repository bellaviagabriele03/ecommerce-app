import { useCallback, useState } from "react";
import { ToastContext } from "./toastContext";

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (toast) => {
            const id = crypto.randomUUID();
            setToasts((prev) => [...prev, { id, ...toast }]);
            setTimeout(() => removeToast(id), AUTO_DISMISS_MS);
        },
        [removeToast]
    );

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
}
