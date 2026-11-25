export default function ProductDetailSkeleton() {
    return (
        <div className="animate-pulse px-6 py-8">
            <div className="h-4 w-48 bg-surface" />
            <div className="mt-6 grid gap-10 lg:grid-cols-2">
                <div className="aspect-square bg-surface" />
                <div className="space-y-4">
                    <div className="h-3 w-24 bg-surface" />
                    <div className="h-8 w-3/4 bg-surface" />
                    <div className="h-6 w-1/3 bg-surface" />
                    <div className="h-24 bg-surface" />
                    <div className="h-12 bg-surface" />
                </div>
            </div>
        </div>
    );
}
