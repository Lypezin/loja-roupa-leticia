import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductSubmitSectionProps {
    isLoading: boolean
    isEditing: boolean
}

export function ProductSubmitSection({ isLoading, isEditing }: ProductSubmitSectionProps) {
    return (
        <div className="rounded-[1.8rem] border border-zinc-950 bg-zinc-950 p-5 text-white shadow-[0_18px_40px_rgba(25,20,18,0.18)] md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Finalização</p>
                    <p className="mt-2 text-sm leading-6 text-white/75">
                        O cadastro só é salvo quando imagens, variações e medidas estiverem consistentes.
                    </p>
                </div>
                <Button
                    disabled={isLoading}
                    type="submit"
                    className="h-12 w-full cursor-pointer rounded-full bg-white px-6 text-base text-zinc-950 hover:bg-white/90 lg:w-auto"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Salvando produto...
                        </>
                    ) : (
                        isEditing ? "Atualizar produto" : "Criar produto"
                    )}
                </Button>
            </div>
        </div>
    )
}
