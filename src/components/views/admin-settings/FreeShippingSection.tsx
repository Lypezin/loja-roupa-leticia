import { DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FreeShippingSectionProps {
    threshold: string
}

export function FreeShippingSection({ threshold }: FreeShippingSectionProps) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5">
            <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-zinc-950">Frete grátis</h3>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                Deixe em branco para desativar. Quando esse valor é atingido, a loja oferece a opção mais econômica como frete grátis.
            </p>
            <div className="mt-4 max-w-sm space-y-2">
                <Label htmlFor="free_shipping_threshold" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Pedido mínimo para frete grátis
                </Label>
                <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">R$</span>
                    <Input
                        id="free_shipping_threshold"
                        name="free_shipping_threshold"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={threshold}
                        placeholder="Ex.: 299,90"
                        className="h-11 rounded-xl border-zinc-200 pl-10 focus-visible:ring-zinc-200"
                    />
                </div>
            </div>
        </div>
    )
}
