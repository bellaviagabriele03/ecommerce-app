import { Outlet } from "react-router";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ToastContainer from "./ToastContainer.jsx";

export default function Layout() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
            <ToastContainer />
        </>
    )
}