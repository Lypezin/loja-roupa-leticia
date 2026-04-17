import { CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ProductStatusSectionProps {
    isActive: boolean
}

export function ProductStatusSection({ isActive }: ProductStatusSectionProps) {
    return (
        <section className="rounded-[1.6rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-6">
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                    <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Publicação</p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-950">Status do produto</h3>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-[1.2rem] border border-zinc-200 bg-zinc-50/70 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50">
                <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    defaultChecked={isActive}
                    value="true"
                    className="h-4 w-4 cursor-pointer rounded border-gray-300"
                />
                <Label htmlFor="is_active" className="cursor-pointer text-sm leading-6">
                    Deixar este produto ativo e visível na loja assim que for salvo.
                </Label>
            </div>
        </section>
    )
}
