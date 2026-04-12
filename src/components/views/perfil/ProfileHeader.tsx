import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function ProfileHeader() {
    return (
        <div className="space-y-6">
            <Link href="/conta" className="ink-link">
                <ArrowLeft className="h-4 w-4" />
                Voltar para minha conta
            </Link>

            <div className="paper-panel rounded-[2rem] px-6 py-8 md:px-8">
                <span className="eyebrow">dados pessoais</span>
                <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">Editar perfil</h1>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">Atualize os dados básicos da sua conta com segurança.</p>
            </div>
        </div>
    )
}
