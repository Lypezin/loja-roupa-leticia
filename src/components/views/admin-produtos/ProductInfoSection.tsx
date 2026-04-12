import { Package2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Category {
    id: string
    name: string
}

interface ProductInfoSectionProps {
    product?: {
        name: string
        description?: string
        base_price: number
        category_id: string
    }
    categories: Category[]
}

export function ProductInfoSection({ product, categories }: ProductInfoSectionProps) {
    return (
        <section className="rounded-[1.6rem] border border-zinc-200/80 bg-white/90 p-5 shadow-[0_18px_40px_rgba(79,55,39,0.05)] md:p-6">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700">
                    <Package2 className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Produto</p>
                    <h3 className="mt-2 text-lg font-semibold text-zinc-950">Informações principais</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                        Defina nome, categoria, descrição e preço base antes de montar imagens e variações.
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome do produto</Label>
                    <Input id="name" name="name" defaultValue={product?.name} required className="h-11 rounded-2xl border-zinc-200 bg-zinc-50/60" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={product?.description}
                        rows={4}
                        className="min-h-28 resize-y rounded-2xl border-zinc-200 bg-zinc-50/60"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="base_price">Preço base</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">R$</span>
                            <Input
                                id="base_price"
                                name="base_price"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={product?.base_price}
                                required
                                className="h-11 rounded-2xl border-zinc-200 bg-zinc-50/60 pl-9"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category_id">Categoria</Label>
                        <select
                            id="category_id"
                            name="category_id"
                            className="flex h-11 w-full cursor-pointer rounded-2xl border border-zinc-200 bg-zinc-50/60 px-3 py-2 text-sm ring-offset-background"
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
    )
}
