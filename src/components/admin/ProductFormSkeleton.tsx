import { Skeleton } from '@/components/ui/skeleton'

export function ProductFormSkeleton() {
    return (
        <div className="space-y-8 rounded-xl border bg-white p-6">
            <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-3 border-t pt-6">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-24 w-full" />
            </div>

            <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-44" />
                    <Skeleton className="h-9 w-44" />
                </div>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>

            <div className="border-t pt-6">
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
}
