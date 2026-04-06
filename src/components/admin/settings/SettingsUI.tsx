'use client'

import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { ElementType } from "react"

interface SectionHeaderProps {
    icon: ElementType
    title: string
    description?: string
}

export function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
    return (
        <div className="mb-8 flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-secondary text-foreground">
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">painel</p>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
                </div>
            </div>
            {description ? (
                <p className="ml-14 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
            ) : null}
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
        <div className="mt-8 flex items-center justify-end gap-4 border-t border-border pt-6">
            {success ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Alteracoes salvas
                </span>
            ) : null}
            <Button
                disabled={isLoading}
                type="submit"
                className="h-11 cursor-pointer rounded-full px-8 text-xs font-semibold uppercase tracking-[0.18em] shadow-sm active:scale-[0.99]"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
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
