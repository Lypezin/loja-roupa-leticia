import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
    return (
        <div className="flex flex-col gap-8 w-full p-6 lg:p-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-[200px]" />
                    <Skeleton className="h-4 w-[300px]" />
                </div>
                <Skeleton className="h-10 w-[150px]" />
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}
