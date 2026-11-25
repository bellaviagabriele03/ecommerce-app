export default function ProductCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-square bg-surface" />
            <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 bg-surface" />
                <div className="h-3 w-1/2 bg-surface" />
                <div className="h-4 w-1/4 bg-surface" />
            </div>
        </div>
    );
}
