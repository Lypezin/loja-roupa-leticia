import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full border-t bg-zinc-50 mt-12">
            <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center">
                <div className="font-bold text-xl tracking-tighter mb-4">LOJA MODA</div>
                <p className="text-sm text-zinc-500 mb-6 max-w-md">
                    Peças exclusivas, qualidade premium e envio para todo o Brasil. Feito para você.
                </p>

                <div className="flex gap-6 text-sm text-zinc-500 mb-8">
                    <Link href="/sobre" className="hover:text-zinc-900 transition-colors">Sobre</Link>
                    <Link href="/contato" className="hover:text-zinc-900 transition-colors">Contato</Link>
                    <Link href="/termos" className="hover:text-zinc-900 transition-colors">Termos de Uso</Link>
                </div>

                <div className="text-xs text-zinc-400">
                    © {new Date().getFullYear()} LOJA MODA. Todos os direitos reservados.
                </div>
            </div>
        </footer>
    )
}
