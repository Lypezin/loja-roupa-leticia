import { Button } from "@/components/ui/button"

export default function ConfiguracoesPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
                <p className="text-zinc-500">
                    Gerencie os metadados da sua loja, frete e preferências globais.
                </p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 text-center text-zinc-500">
                <p className="mb-4">O painel de configurações gerais será disponibilizado em breve.</p>
                <Button variant="outline" disabled>
                    Em Desenvolvimento
                </Button>
            </div>
        </div>
    )
}
