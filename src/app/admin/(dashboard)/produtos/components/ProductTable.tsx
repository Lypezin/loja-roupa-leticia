import Image from "next/image"
import { Loader2, MoreVertical, Package, Pencil } from "lucide-react"
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
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="h-auto py-4 font-semibold text-foreground">Produto</TableHead>
                        <TableHead className="h-auto py-4 font-semibold text-foreground">Categoria</TableHead>
                        <TableHead className="h-auto py-4 font-semibold text-foreground">Preço base</TableHead>
                        <TableHead className="h-auto py-4 font-semibold text-foreground">Status</TableHead>
                        <TableHead className="h-auto py-4 text-right font-semibold text-foreground">Ações</TableHead>
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
                            <TableRow key={product.id} className="group transition-all duration-200 hover:bg-muted/30">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted transition-colors group-hover:border-border">
                                            {primaryImage ? (
                                                <Image src={primaryImage} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Package className="h-5 w-5 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="mb-1 font-semibold leading-none text-foreground transition-colors group-hover:text-foreground/80">{product.name}</p>
                                            <p className="text-xs font-medium text-muted-foreground">ID: {product.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-bold uppercase tracking-tight text-foreground/70">
                                        {categoryName}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="font-medium text-foreground">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.base_price)}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${product.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${product.is_active ? "bg-emerald-500" : "bg-red-400"}`} />
                                        {product.is_active ? "Ativo" : "Oculto"}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 pr-2 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                                        <AdminRouteButton
                                            href={`/admin/produtos/${product.id}/editar`}
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl border border-transparent hover:border-border hover:bg-background"
                                            pendingContent={<Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                                            aria-label={`Editar ${product.name}`}
                                        >
                                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                                        </AdminRouteButton>
                                        <DeleteProductButton productId={product.id} productName={product.name} />
                                    </div>
                                    <div className="hidden pr-2 sm:block sm:group-hover:hidden">
                                        <MoreVertical className="ml-auto h-4 w-4 text-muted-foreground/40" />
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
