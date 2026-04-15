import { Loader2, Link2, ShieldAlert, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MelhorEnvioIntegrationStatus } from "@/types/shipping"

interface MelhorEnvioConnectionProps {
    melhorEnvio: MelhorEnvioIntegrationStatus
    isDisconnecting: boolean
    onDisconnect: () => void
}

export function MelhorEnvioConnection({ melhorEnvio, isDisconnecting, onDisconnect }: MelhorEnvioConnectionProps) {
    const environmentLabel = melhorEnvio.environment === "production" ? "producao" : "sandbox"

    return (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        {melhorEnvio.connected ? (
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        ) : (
                            <ShieldAlert className="h-4 w-4 text-amber-600" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                            Melhor Envio ({environmentLabel})
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-950">
                        {melhorEnvio.connected ? "Conta conectada" : "Conecte sua conta"}
                    </h3>
                    <p className="max-w-2xl text-sm leading-6 text-zinc-600">
                        O Melhor Envio fornece transportadoras e cotacao. O CEP de origem e as medidas dos produtos continuam sob responsabilidade da loja.
                    </p>
                    {melhorEnvio.connected && (
                        <div className="space-y-1 text-xs text-zinc-500">
                            {melhorEnvio.account_name && <p>Conta: {melhorEnvio.account_name}</p>}
                            {melhorEnvio.account_email && <p>E-mail conectado: {melhorEnvio.account_email}</p>}
                            {melhorEnvio.scope && <p>Escopos: {melhorEnvio.scope}</p>}
                            {melhorEnvio.connected_at && (
                                <p>
                                    Conectado em {new Date(melhorEnvio.connected_at).toLocaleString("pt-BR")}
                                    {melhorEnvio.expires_at ? ` | token valido ate ${new Date(melhorEnvio.expires_at).toLocaleString("pt-BR")}` : ""}
                                </p>
                            )}
                        </div>
                    )}
                    {melhorEnvio.connected && melhorEnvio.missing_scopes.length > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                            Faltam escopos para emissao automatica de etiqueta: {melhorEnvio.missing_scopes.join(", ")}.
                            Reconecte a conta para liberar esses escopos.
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        type="button"
                        variant={melhorEnvio.connected ? "outline" : "default"}
                        className="rounded-full"
                        onClick={() => {
                            window.location.href = "/api/integrations/melhor-envio/connect"
                        }}
                    >
                        <Link2 className="h-4 w-4" />
                        {melhorEnvio.connected ? "Reconectar conta" : "Conectar Melhor Envio"}
                    </Button>

                    {melhorEnvio.connected && (
                        <Button
                            type="button"
                            variant="outline"
                            className="rounded-full"
                            disabled={isDisconnecting}
                            onClick={onDisconnect}
                        >
                            {isDisconnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Desconectar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
