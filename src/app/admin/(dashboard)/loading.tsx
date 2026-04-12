import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
    return (
        <div className="flex w-full flex-col gap-6">
            <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(79,55,39,0.08)]">
                <div className="space-y-3">
                    <Skeleton className="h-6 w-36 rounded-full" />
                    <Skeleton className="h-14 w-full max-w-[34rem]" />
                    <Skeleton className="h-5 w-full max-w-[42rem]" />
                </div>

                <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="rounded-[1.4rem] border border-zinc-200 bg-zinc-50/70 p-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="mt-3 h-8 w-20" />
                            <Skeleton className="mt-2 h-4 w-28" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_18px_40px_rgba(79,55,39,0.05)]">
                <div className="space-y-3">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-4 w-full max-w-[28rem]" />
                </div>

                <div className="mt-6 space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-20 w-full rounded-[1.2rem]" />
                    ))}
                </div>
            </div>
        </div>
    )
}
