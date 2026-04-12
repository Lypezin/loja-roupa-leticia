import { Copy, RefreshCcw, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ShippingDefaults } from "@/components/admin/ProductBasicInfo"

interface ProductShippingSectionProps {
    shippingFields: {
        weight_kg: string
        length_cm: string
        width_cm: string
        height_cm: string
    }
    setShippingFields: React.Dispatch<React.SetStateAction<{
        weight_kg: string
        length_cm: string
        width_cm: string
        height_cm: string
    }>>
    shippingDefaults?: ShippingDefaults | null
    hasCompleteShippingFields: boolean
    onApplyDefaults: () => void
    onClearFields: () => void
}

export function ProductShippingSection({
    shippingFields,
    setShippingFields,
    shippingDefaults,
    hasCompleteShippingFields,
    onApplyDefaults,
    onClearFields,
}: ProductShippingSectionProps) {
    return (
        <section className="rounded-[1.6rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                        <Truck className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Frete</p>
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${hasCompleteShippingFields ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                {hasCompleteShippingFields ? "Pacote pronto" : "Medidas pendentes"}
                            </span>
                        </div>
                        <h3 className="mt-2 text-lg font-semibold text-zinc-950">Pacote usado na cotação</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Preencha o peso e as dimensões do produto já embalado para envio. Essas informações são usadas pelo Melhor Envio no carrinho.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                    {shippingDefaults && (
                        <Button type="button" variant="outline" size="sm" className="rounded-full border-zinc-200" onClick={onApplyDefaults}>
                            <Copy className="h-4 w-4" />
                            Usar últimas medidas salvas
                        </Button>
                    )}
                    <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={onClearFields}>
                        <RefreshCcw className="h-4 w-4" />
                        Limpar
                    </Button>
                </div>
            </div>

            {shippingDefaults && (
                <div className="mt-4 rounded-[1.2rem] border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm text-zinc-600">
                    Último pacote salvo na loja: <strong className="text-zinc-950">{shippingDefaults.sourceProductName}</strong>
                    {" "}({shippingDefaults.weight_kg} kg | {shippingDefaults.length_cm} x {shippingDefaults.width_cm} x {shippingDefaults.height_cm} cm)
                </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                    { id: "weight_kg", label: "Peso (kg)", step: "0.001", min: "0.001", placeholder: "Ex.: 0,400" },
                    { id: "length_cm", label: "Comprimento (cm)", step: "0.01", min: "0.01", placeholder: "Ex.: 30" },
                    { id: "width_cm", label: "Largura (cm)", step: "0.01", min: "0.01", placeholder: "Ex.: 25" },
                    { id: "height_cm", label: "Altura (cm)", step: "0.01", min: "0.01", placeholder: "Ex.: 5" },
                ].map((field) => (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <Input
                            id={field.id}
                            name={field.id}
                            type="number"
                            step={field.step}
                            min={field.min}
                            placeholder={field.placeholder}
                            value={shippingFields[field.id as keyof typeof shippingFields]}
                            onChange={(event) => setShippingFields((current) => ({ ...current, [field.id]: event.target.value }))}
                            required
                            className="h-11 rounded-2xl border-zinc-200 bg-zinc-50/60"
                        />
                    </div>
                ))}
            </div>

            <p className="mt-4 text-xs leading-5 text-zinc-500">
                Dica: se você usa a mesma embalagem para peças parecidas, pode reaproveitar as últimas medidas salvas e ajustar só quando o volume mudar.
            </p>
        </section>
    )
}
