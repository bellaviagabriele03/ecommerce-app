import { NavLink } from "react-router";

export default function Navbar() {

    const links = [
        { name: "HOME", path: "/" },
        { name: "CATALOGO", path: "/catalog" },
        { name: "CARRELLO", path: "/cart" }
    ]



    return (
        <>
            <header className="p-4 bg-gradient-to-b from-black-600 to-gray-700 text-2xl mb-3">
                <nav className="flex gap-2">
                    {links.map((l, i) => {
                        return (
                            <div
                                className="">
                                <NavLink to={l.path}>{l.name}</NavLink>
                            </div>
                        )
                    })}
                </nav>
            </header>

        </>
    )
}