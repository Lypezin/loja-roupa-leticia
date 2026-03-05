'use client'

import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"

interface SectionHeaderProps {
    icon: any
    title: string
}

export function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
    return (
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
            <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center">
                <Icon className="w-4 h-4 text-zinc-600" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
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
        <div className="pt-4 border-t border-zinc-100 mt-6 flex justify-end items-center gap-3">
            {success && (
                <span className="text-sm text-emerald-600 flex items-center gap-1 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Salvo com sucesso!
                </span>
            )}
            <Button disabled={isLoading} type="submit" className="px-6 bg-zinc-950 text-white cursor-pointer h-10 rounded-xl hover:bg-zinc-800 transition-colors">
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                    </span>
                ) : label}
            </Button>
        </div>
    )
}

export function showSuccess(setter: (v: boolean) => void) {
    setter(true)
    setTimeout(() => setter(false), 3000)
}
