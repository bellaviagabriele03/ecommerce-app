import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ToastContainer from "./ToastContainer.jsx";

export default function Layout() {
    const location = useLocation();

    return (
        <>
            <Navbar />
            <main>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            <Footer />
            <ToastContainer />
        </>
    )
}