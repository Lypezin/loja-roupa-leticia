import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="text-8xl font-bold tracking-tighter text-zinc-200">404</div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Página não encontrada
                </h1>
                <p className="text-zinc-500">
                    A página que você está procurando não existe ou foi movida. Que tal voltar para a loja?
                </p>
                <div className="flex items-center justify-center gap-3 pt-4">
                    <Link href="/">
                        <Button className="bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer gap-2">
                            <Home className="w-4 h-4" />
                            Ir para a Loja
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
