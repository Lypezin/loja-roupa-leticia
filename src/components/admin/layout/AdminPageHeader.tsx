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
        <div className={cn("rounded-[1.9rem] border border-zinc-200/80 bg-white/92 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-6", className)}>
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="space-y-3">
                    {eyebrow && (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            {eyebrow}
                        </p>
                    )}
                    <h1 className="font-display text-[2.35rem] leading-[0.94] text-zinc-950 md:text-[3.2rem]">
                        {title}
                    </h1>
                    {description && (
                        <p className="max-w-3xl text-sm leading-7 text-zinc-600 md:text-base md:leading-8">
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
        </div>
    )
}
