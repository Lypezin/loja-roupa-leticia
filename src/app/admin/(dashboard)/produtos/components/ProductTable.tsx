import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table"
import Image from "next/image"
import Link from "next/link"
import { Package, Pencil, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DeleteProductButton } from "./DeleteProductButton"

interface ProductTableProps {
    products: any[];
}

export function ProductTable({ products }: ProductTableProps) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-foreground py-4 h-auto">Produto</TableHead>
                        <TableHead className="font-semibold text-foreground py-4 h-auto">Categoria</TableHead>
                        <TableHead className="font-semibold text-foreground py-4 h-auto">Preço Base</TableHead>
                        <TableHead className="font-semibold text-foreground py-4 h-auto">Status</TableHead>
                        <TableHead className="text-right font-semibold text-foreground py-4 h-auto">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => {
                        const category = product.category as any
                        const categoryName = category
                            ? (Array.isArray(category) ? category[0]?.name : category.name)
                            : 'Sem categoria'

                        const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url
                            || product.images?.[0]?.image_url

                        return (
                            <TableRow key={product.id} className="group hover:bg-muted/30 transition-all duration-200">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-xl bg-muted flex-shrink-0 overflow-hidden border border-border/60 group-hover:border-border transition-colors">
                                            {primaryImage ? (
                                                <Image src={primaryImage} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground leading-none mb-1 group-hover:text-foreground/80 transition-colors">{product.name}</p>
                                            <p className="text-xs text-muted-foreground font-medium">ID: {product.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-foreground/70 text-[11px] font-bold uppercase tracking-tight">
                                        {categoryName}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="font-medium text-foreground">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.base_price)}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${product.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${product.is_active ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                                        {product.is_active ? 'Ativo' : 'Oculto'}
                                    </span>
                                </TableCell>
                                <TableCell className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-xl cursor-pointer border border-transparent hover:border-border hover:bg-background">
                                            <Link href={`/admin/produtos/${product.id}/editar`}>
                                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                                            </Link>
                                        </Button>
                                        <DeleteProductButton productId={product.id} productName={product.name} />
                                    </div>
                                    <div className="group-hover:hidden pr-2">
                                        <MoreVertical className="w-4 h-4 text-muted-foreground/40 ml-auto" />
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
