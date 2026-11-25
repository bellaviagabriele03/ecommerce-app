function initialsOf(firstName, lastName, email) {
    if (firstName || lastName) {
        return `${(firstName ?? "")[0] ?? ""}${(lastName ?? "")[0] ?? ""}`.toUpperCase();
    }
    return (email ?? "?")[0].toUpperCase();
}

export default function Avatar({ firstName, lastName, email, size = "lg" }) {
    const initials = initialsOf(firstName, lastName, email);
    const dimension = size === "lg" ? "h-20 w-20 text-2xl" : "h-10 w-10 text-sm";

    return (
        <div
            className={`flex ${dimension} shrink-0 items-center justify-center rounded-full bg-action font-display uppercase text-primary`}
        >
            {initials}
        </div>
    );
}
