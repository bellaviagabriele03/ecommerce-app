import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useToast } from "../hooks/useToast";

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-3">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 32 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start gap-3 bg-surface p-4 shadow-lg"
                    >
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-action" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-primary">{toast.title}</p>
                            {toast.message ? <p className="text-sm text-secondary">{toast.message}</p> : null}
                            {toast.actionTo ? (
                                <Link to={toast.actionTo} className="mt-1 inline-block text-sm text-action hover:underline">
                                    {toast.actionLabel ?? "View →"}
                                </Link>
                            ) : null}
                        </div>
                        <button onClick={() => removeToast(toast.id)} aria-label="Dismiss" className="text-secondary hover:text-primary">
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
