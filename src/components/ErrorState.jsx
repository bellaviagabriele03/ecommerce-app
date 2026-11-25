export default function ErrorState({
    title = "Something went wrong.",
    message = "We couldn't load this page. Please try again.",
    onRetry,
}) {
    return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
            <h2 className="font-display text-3xl uppercase text-primary">{title}</h2>
            <p className="max-w-md text-secondary">{message}</p>
            {onRetry ? (
                <button
                    onClick={onRetry}
                    className="bg-action px-6 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-action-hover"
                >
                    Retry
                </button>
            ) : null}
        </div>
    );
}
