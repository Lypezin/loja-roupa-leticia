import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface SearchResultsProps {
    results: any[];
    isOpen: boolean;
    query: string;
    onClose: () => void;
    onSearch: (e: React.FormEvent) => void;
}

export function SearchResults({ results, isOpen, query, onClose, onSearch }: SearchResultsProps) {
    return (
        <AnimatePresence>
            {isOpen && results.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden z-[100]">
                    <div className="p-2 space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground px-3 py-1 uppercase tracking-widest">Sugestões</p>
                        {results.map((product) => (
                            <Link key={product.id} href={`/produto/${product.id}`} onClick={onClose} className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors group">
                                <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden relative">
                                    <Image src={product.product_images?.[0]?.image_url || "/placeholder.jpg"} alt={product.name} fill className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.base_price)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <button onClick={onSearch} className="w-full p-3 bg-muted/50 text-center text-xs font-bold text-foreground hover:bg-muted transition-colors border-t border-border">
                        Ver todos os resultados para &quot;{query}&quot;
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
