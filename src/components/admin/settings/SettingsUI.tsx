'use client'

import type { ElementType } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SectionHeaderProps {
    icon: ElementType
    title: string
    description?: string
}

export function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Configuração
                    </p>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">{title}</h2>
                    {description ? (
                        <p className="max-w-2xl text-sm leading-7 text-zinc-600">{description}</p>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

interface SaveButtonProps {
    isLoading: boolean
    success: boolean
    label: string
}

export function SaveButton({ isLoading, success, label }: SaveButtonProps) {
    return (
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                {success ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Alterações salvas
                    </span>
                ) : (
                    <span className="text-xs leading-5 text-zinc-500">
                        As mudanças são aplicadas nesta área assim que o salvamento termina.
                    </span>
                )}
            </div>

            <Button
                disabled={isLoading}
                type="submit"
                className="h-11 cursor-pointer rounded-full bg-zinc-950 px-8 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-zinc-800"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                    </span>
                ) : label}
            </Button>
        </div>
    )
}

export function showSuccess(setter: (value: boolean) => void) {
    setter(true)
    setTimeout(() => setter(false), 3000)
}
