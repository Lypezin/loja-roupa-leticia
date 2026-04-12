'use client'

import { useState } from "react"
import { Copy, Package2, RefreshCcw, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Category = {
    id: string
    name: string
}

export type ShippingDefaults = {
    sourceProductName: string
    weight_kg: number
    length_cm: number
    width_cm: number
    height_cm: number
}

interface ProductBasicInfoProps {
    product?: {
        name: string
        description?: string
        base_price: number
        category_id: string
        weight_kg?: number | null
        height_cm?: number | null
        width_cm?: number | null
        length_cm?: number | null
    }
    categories: Category[]
    shippingDefaults?: ShippingDefaults | null
}

function formatFieldValue(value?: number | null) {
    return typeof value === "number" && Number.isFinite(value) ? String(value) : ""
}

function buildDefaultShippingState(product?: ProductBasicInfoProps["product"]) {
    return {
        weight_kg: formatFieldValue(product?.weight_kg),
        length_cm: formatFieldValue(product?.length_cm),
        width_cm: formatFieldValue(product?.width_cm),
        height_cm: formatFieldValue(product?.height_cm),
    }
}

export function ProductBasicInfo({ product, categories, shippingDefaults }: ProductBasicInfoProps) {
    const [shippingFields, setShippingFields] = useState(buildDefaultShippingState(product))

    const hasCompleteShippingFields = Object.values(shippingFields).every(Boolean)

    const applyShippingDefaults = () => {
        if (!shippingDefaults) {
            return
        }

        setShippingFields({
            weight_kg: String(shippingDefaults.weight_kg),
            length_cm: String(shippingDefaults.length_cm),
            width_cm: String(shippingDefaults.width_cm),
            height_cm: String(shippingDefaults.height_cm),
        })
    }

    const clearShippingFields = () => {
        setShippingFields({
            weight_kg: "",
            length_cm: "",
            width_cm: "",
            height_cm: "",
        })
    }

    return (
        <div className="space-y-6">
            <section className="rounded-[1.6rem] border border-zinc-200 bg-zinc-50/60 p-5 md:p-6">
                <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700">
                        <Package2 className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Produto</p>
                        <h3 className="mt-2 text-lg font-semibold text-zinc-950">Informações principais</h3>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                            Cadastre o nome, a categoria e o preço base antes de montar imagens e variações.
                        </p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <Label htmlFor="name">Nome do produto</Label>
                        <Input id="name" name="name" defaultValue={product?.name} required />
                    </div>

                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={product?.description}
                            rows={4}
                            className="min-h-28 resize-y"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="base_price">Preço base (R$)</Label>
                            <Input
                                id="base_price"
                                name="base_price"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={product?.base_price}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="category_id">Categoria</Label>
                            <select
                                id="category_id"
                                name="category_id"
                                className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                defaultValue={product?.category_id || ""}
                                required
                            >
                                <option value="" disabled>Selecione uma categoria</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-[1.6rem] border border-zinc-200 bg-white p-5 md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700">
                            <Truck className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Frete</p>
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
                        {shippingDefaults ? (
                            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={applyShippingDefaults}>
                                <Copy className="h-4 w-4" />
                                Usar últimas medidas salvas
                            </Button>
                        ) : null}
                        <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={clearShippingFields}>
                            <RefreshCcw className="h-4 w-4" />
                            Limpar
                        </Button>
                    </div>
                </div>

                {shippingDefaults ? (
                    <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm text-zinc-600">
                        Último pacote salvo na loja: <strong className="text-zinc-950">{shippingDefaults.sourceProductName}</strong>
                        {" "}({shippingDefaults.weight_kg} kg | {shippingDefaults.length_cm} x {shippingDefaults.width_cm} x {shippingDefaults.height_cm} cm)
                    </div>
                ) : null}

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="weight_kg">Peso (kg)</Label>
                        <Input
                            id="weight_kg"
                            name="weight_kg"
                            type="number"
                            step="0.001"
                            min="0.001"
                            placeholder="Ex.: 0,400"
                            value={shippingFields.weight_kg}
                            onChange={(event) => setShippingFields((current) => ({ ...current, weight_kg: event.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="length_cm">Comprimento (cm)</Label>
                        <Input
                            id="length_cm"
                            name="length_cm"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Ex.: 30"
                            value={shippingFields.length_cm}
                            onChange={(event) => setShippingFields((current) => ({ ...current, length_cm: event.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="width_cm">Largura (cm)</Label>
                        <Input
                            id="width_cm"
                            name="width_cm"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Ex.: 25"
                            value={shippingFields.width_cm}
                            onChange={(event) => setShippingFields((current) => ({ ...current, width_cm: event.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="height_cm">Altura (cm)</Label>
                        <Input
                            id="height_cm"
                            name="height_cm"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Ex.: 5"
                            value={shippingFields.height_cm}
                            onChange={(event) => setShippingFields((current) => ({ ...current, height_cm: event.target.value }))}
                            required
                        />
                    </div>
                </div>

                <p className="mt-4 text-xs leading-5 text-zinc-500">
                    Dica: se você usa a mesma embalagem para peças parecidas, pode reaproveitar as últimas medidas salvas e ajustar só quando o volume mudar.
                </p>
            </section>
        </div>
    )
}
