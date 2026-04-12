import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AdminPageHeaderProps {
    eyebrow?: string
    title: string
    description?: string
    actions?: ReactNode
    className?: string
}

export function AdminPageHeader({
    eyebrow,
    title,
    description,
    actions,
    className,
}: AdminPageHeaderProps) {
    return (
        <div className={cn("mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
            <div className="space-y-1.5">
                {eyebrow && (
                    <p className="text-sm font-medium text-zinc-500">
                        {eyebrow}
                    </p>
                )}
                <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                    {title}
                </h1>
                {description && (
                    <p className="text-base text-zinc-600 max-w-2xl">
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div className="flex shrink-0 items-center gap-3">
                    {actions}
                </div>
            )}
        </div>
    )
}
