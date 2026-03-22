import { BarChart3 } from "lucide-react"

export function AdminActivitySection() {
    return (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Atividade Recente</h3>
                    <p className="text-xs text-muted-foreground">Últimas ações na loja</p>
                </div>
            </div>
            <div className="flex items-center justify-center py-8">
                <div className="text-center">
                    <BarChart3 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
                    <p className="text-xs text-muted-foreground/80 mt-1">As atividades aparecerão aqui quando você começar a receber pedidos.</p>
                </div>
            </div>
        </div>
    )
}
