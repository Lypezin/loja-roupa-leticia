import { ProductFormSkeleton } from "@/components/admin/ProductFormSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditProductLoading() {
    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-[2rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(79,55,39,0.08)]">
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="mt-3 h-12 w-full max-w-[24rem]" />
                <Skeleton className="mt-3 h-5 w-full max-w-[38rem]" />
            </div>

            <ProductFormSkeleton />
        </div>
    )
}
