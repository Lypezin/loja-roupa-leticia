import { Skeleton } from "@/components/ui/skeleton"

export function ProductFormSkeleton() {
    return (
        <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
            <div className="space-y-6">
                <div className="rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <Skeleton className="h-4 w-28 rounded-full" />
                    <Skeleton className="mt-3 h-10 w-full max-w-xl" />
                    <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
                </div>

                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-[1.6rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                        <Skeleton className="h-4 w-28 rounded-full" />
                        <Skeleton className="mt-3 h-8 w-64" />
                        <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
                        <div className="mt-6 space-y-3">
                            <Skeleton className="h-11 w-full rounded-2xl" />
                            <Skeleton className="h-28 w-full rounded-2xl" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4 xl:sticky xl:top-8 xl:self-start">
                <div className="rounded-[1.6rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <div className="mt-4 space-y-3">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton key={index} className="h-5 w-full" />
                        ))}
                    </div>
                </div>
                <Skeleton className="h-36 w-full rounded-[1.6rem]" />
            </div>
        </div>
    )
}
