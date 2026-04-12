import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type AdminPageHeaderMetric = {
    label: string
    value: string
    description?: string
}

interface AdminPageHeaderProps {
    eyebrow?: string
    title: string
    description: string
    actions?: ReactNode
    metrics?: AdminPageHeaderMetric[]
    className?: string
}

export function AdminPageHeader({
    eyebrow = "Painel administrativo",
    title,
    description,
    actions,
    metrics,
    className,
}: AdminPageHeaderProps) {
    return (
        <section
            className={cn(
                "relative overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/90 p-6 shadow-[0_24px_80px_rgba(79,55,39,0.08)] backdrop-blur xl:p-8",
                className,
            )}
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300/80 to-transparent" />

            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl space-y-3">
                    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        {eyebrow}
                    </span>
                    <div className="space-y-3">
                        <h1 className="text-4xl leading-none font-semibold tracking-[-0.05em] text-zinc-950 md:text-[3.35rem]">
                            {title}
                        </h1>
                        <p className="max-w-2xl text-sm leading-7 text-zinc-600 md:text-[15px]">
                            {description}
                        </p>
                    </div>
                </div>

                {actions ? (
                    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                        {actions}
                    </div>
                ) : null}
            </div>

            {metrics?.length ? (
                <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {metrics.map((metric) => (
                        <div
                            key={metric.label}
                            className="rounded-[1.4rem] border border-zinc-200/80 bg-zinc-50/70 px-4 py-4"
                        >
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                {metric.label}
                            </p>
                            <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
                                {metric.value}
                            </p>
                            {metric.description ? (
                                <p className="mt-1 text-xs leading-5 text-zinc-500">
                                    {metric.description}
                                </p>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : null}
        </section>
    )
}

export type { AdminPageHeaderMetric }
