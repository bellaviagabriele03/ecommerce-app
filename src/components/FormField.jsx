export default function FormField({ label, error, as = "input", className = "", children, ...inputProps }) {
    const Tag = as;

    return (
        <label className={`block ${className}`}>
            <span className="text-sm font-medium text-primary">{label}</span>
            <Tag
                className={`search-bar mt-1 w-full px-3 py-2 text-sm text-primary placeholder-secondary outline-none focus:ring-1 ${
                    error ? "ring-1 ring-error" : "focus:ring-action"
                }`}
                {...inputProps}
            >
                {children}
            </Tag>
            {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
        </label>
    );
}
