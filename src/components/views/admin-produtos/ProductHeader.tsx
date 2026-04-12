import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ProductHeaderProps {
    isEditing: boolean
}

export function ProductHeader({ isEditing }: ProductHeaderProps) {
    return (
        <div className="rounded-[1.8rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        {isEditing ? "Edição" : "Cadastro"}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
                        {isEditing ? "Ajuste o produto com contexto completo" : "Monte o produto em etapas simples"}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-zinc-600">
                        Primeiro defina os dados principais e o pacote de frete. Depois organize imagens, variações e visibilidade.
                    </p>
                </div>
                <Button asChild variant="outline" className="rounded-full border-zinc-200 px-5">
                    <Link href="/admin/produtos">Voltar para produtos</Link>
                </Button>
            </div>
        </div>
    )
}
