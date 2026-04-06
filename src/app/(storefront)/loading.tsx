export default function Loading() {
    return (
        <div className="page-shell py-8 md:py-10">
            <section className="paper-panel overflow-hidden rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
                <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div className="space-y-5">
                        <div className="h-3 w-28 animate-pulse rounded-full bg-secondary" />
                        <div className="space-y-3">
                            <div className="h-12 w-full max-w-2xl animate-pulse rounded-full bg-secondary/85 md:h-16" />
                            <div className="h-12 w-4/5 max-w-xl animate-pulse rounded-full bg-secondary/70 md:h-16" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-3 w-full max-w-xl animate-pulse rounded-full bg-secondary/70" />
                            <div className="h-3 w-5/6 max-w-lg animate-pulse rounded-full bg-secondary/55" />
                        </div>
                        <div className="flex flex-wrap gap-3 pt-3">
                            <div className="h-11 w-36 animate-pulse rounded-full bg-secondary/80" />
                            <div className="h-11 w-36 animate-pulse rounded-full bg-secondary/60" />
                        </div>
                    </div>

                    <div className="relative aspect-[4/5] overflow-hidden rounded-[1.8rem] bg-secondary/70">
                        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-secondary to-secondary/40" />
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <div className="space-y-3">
                    <div className="h-3 w-24 animate-pulse rounded-full bg-secondary/80" />
                    <div className="h-10 w-64 animate-pulse rounded-full bg-secondary/70" />
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="paper-panel space-y-4 rounded-[1.8rem] p-4">
                            <div className="aspect-[5/4] animate-pulse rounded-[1.3rem] bg-secondary/75" />
                            <div className="h-3 w-24 animate-pulse rounded-full bg-secondary/80" />
                            <div className="h-6 w-2/3 animate-pulse rounded-full bg-secondary/65" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                    <div className="space-y-3">
                        <div className="h-3 w-28 animate-pulse rounded-full bg-secondary/80" />
                        <div className="h-10 w-56 animate-pulse rounded-full bg-secondary/65" />
                    </div>
                    <div className="hidden h-10 w-32 animate-pulse rounded-full bg-secondary/65 md:block" />
                </div>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="space-y-4">
                            <div className="aspect-[3/4] animate-pulse rounded-[1.6rem] bg-secondary/75" />
                            <div className="h-3 w-20 animate-pulse rounded-full bg-secondary/75" />
                            <div className="h-6 w-4/5 animate-pulse rounded-full bg-secondary/60" />
                            <div className="h-4 w-24 animate-pulse rounded-full bg-secondary/55" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}
