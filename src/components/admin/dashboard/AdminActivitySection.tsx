import { BarChart3 } from "lucide-react"

export function AdminActivitySection() {
    return (
        <div className="surface-card rounded-[1.8rem] p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <BarChart3 className="h-4.5 w-4.5" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-foreground">Atividade recente</h3>
                    <p className="text-xs text-muted-foreground">As ultimas mudancas e pedidos aparecem aqui.</p>
                </div>
            </div>
            <div className="mt-6 rounded-[1.4rem] border border-border bg-card px-5 py-8 text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="mt-4 text-sm font-medium text-foreground">Nenhuma atividade recente</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Assim que a loja receber novos movimentos, este painel passa a refletir o ritmo da operacao.</p>
            </div>
        </div>
    )
}
