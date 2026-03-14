export default function Loading() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Skeleton */}
            <div className="relative h-[85vh] w-full bg-zinc-100 animate-pulse flex items-center justify-center">
                <div className="max-w-2xl w-full px-4 space-y-6 flex flex-col items-center">
                    <div className="h-4 w-32 bg-zinc-200 rounded-full" />
                    <div className="h-16 md:h-24 w-full bg-zinc-200 rounded-2xl" />
                    <div className="h-4 w-64 bg-zinc-200 rounded-full" />
                    <div className="flex gap-4">
                        <div className="h-12 w-40 bg-zinc-200 rounded-full" />
                        <div className="h-12 w-40 bg-zinc-200 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Categories Skeleton */}
            <section className="container mx-auto px-4 py-20">
                 <div className="h-4 w-24 bg-zinc-100 rounded mb-4" />
                 <div className="h-8 w-48 bg-zinc-100 rounded mb-12" />
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[1, 2, 3].map(i => (
                         <div key={i} className="aspect-[16/9] bg-zinc-100 rounded-3xl animate-pulse" />
                     ))}
                 </div>
            </section>

            {/* Products Skeleton */}
            <section className="container mx-auto px-4 py-20">
                <div className="flex items-end justify-between mb-12">
                     <div className="space-y-4">
                        <div className="h-4 w-24 bg-zinc-100 rounded" />
                        <div className="h-8 w-48 bg-zinc-100 rounded" />
                     </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-[3/4] bg-zinc-100 rounded-2xl animate-pulse" />
                            <div className="h-4 w-3/4 bg-zinc-100 rounded" />
                            <div className="h-4 w-1/2 bg-zinc-100 rounded" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
