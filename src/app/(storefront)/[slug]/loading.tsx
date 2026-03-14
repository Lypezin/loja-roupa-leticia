export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-4">
                    <div className="h-10 w-64 bg-zinc-100 rounded-xl animate-pulse" />
                    <div className="h-4 w-48 bg-zinc-100 rounded animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-zinc-100 rounded-xl animate-pulse" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="space-y-4">
                        <div className="aspect-[3/4] bg-zinc-100 rounded-2xl animate-pulse" />
                        <div className="h-4 w-3/4 bg-zinc-100 rounded" />
                        <div className="h-4 w-1/4 bg-zinc-100 rounded" />
                    </div>
                ))}
            </div>
        </div>
    )
}
