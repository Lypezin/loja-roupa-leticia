'use client'

import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

interface SectionHeaderProps {
    icon: any
    title: string
    description?: string
}

export function SectionHeader({ icon: Icon, title, description }: SectionHeaderProps) {
    return (
        <div className="flex flex-col gap-1 mb-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-200">
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h2>
            </div>
            {description && (
                <p className="text-sm text-zinc-500 ml-13 max-w-2xl">{description}</p>
            )}
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
        <div className="pt-6 border-t border-zinc-100 mt-8 flex justify-end items-center gap-4">
            {success && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-medium text-emerald-600 flex items-center gap-1.5"
                >
                    <CheckCircle2 className="w-4 h-4" /> Alterações salvas!
                </motion.span>
            )}
            <Button
                disabled={isLoading}
                type="submit"
                className="px-8 bg-zinc-900 text-white cursor-pointer h-11 rounded-xl hover:bg-zinc-800 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
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
