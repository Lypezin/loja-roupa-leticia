import Image from "next/image"
import { Loader2, Package, Pencil } from "lucide-react"
import { AdminRouteButton } from "@/components/admin/AdminRouteButton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Database } from "@/lib/supabase/database.types"
import { DeleteProductButton } from "./DeleteProductButton"

type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"]
type CategoryRelation = { name: string | null } | Array<{ name: string | null }> | null

export type ProductTableProduct = {
    id: string
    name: string
    base_price: number
    is_active: boolean | null
    category?: CategoryRelation
    images?: ProductImageRow[] | null
}

interface ProductTableProps {
    products: ProductTableProduct[]
}

export function ProductTable({ products }: ProductTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-zinc-50/80">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="h-auto py-4 pl-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Produto</TableHead>
                        <TableHead className="h-auto py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Categoria</TableHead>
                        <TableHead className="h-auto py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Preço base</TableHead>
                        <TableHead className="h-auto py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Status</TableHead>
                        <TableHead className="h-auto py-4 pr-6 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => {
                        const category = product.category
                        const categoryName = Array.isArray(category)
                            ? (category[0]?.name ?? "Sem categoria")
                            : (category?.name ?? "Sem categoria")

                        const primaryImage = product.images?.find((image) => image.is_primary)?.image_url
                            || product.images?.[0]?.image_url

                        return (
                            <TableRow key={product.id} className="transition-colors hover:bg-zinc-50/70">
                                <TableCell className="py-4 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[1.1rem] border border-zinc-200 bg-zinc-50">
                                            {primaryImage ? (
                                                <Image src={primaryImage} alt="" fill className="object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Package className="h-5 w-5 text-zinc-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-zinc-950">{product.name}</p>
                                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                                                ID {product.id.slice(0, 8)}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                                        {categoryName}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="text-sm font-semibold text-zinc-950">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.base_price)}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${product.is_active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${product.is_active ? "bg-emerald-500" : "bg-zinc-500"}`} />
                                        {product.is_active ? "Ativo" : "Oculto"}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4 pr-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <AdminRouteButton
                                            href={`/admin/produtos/${product.id}/editar`}
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-2xl border border-transparent text-zinc-500 hover:border-zinc-200 hover:bg-white hover:text-zinc-950"
                                            pendingContent={<Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-500" />}
                                            aria-label={`Editar ${product.name}`}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </AdminRouteButton>
                                        <DeleteProductButton productId={product.id} productName={product.name} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
