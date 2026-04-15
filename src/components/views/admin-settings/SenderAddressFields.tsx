import React from "react"

interface SenderAddressFieldsProps {
    settings: Record<string, string | number | boolean | null>
}

export function SenderAddressFields({ settings }: SenderAddressFieldsProps) {
    return (
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <div className="space-y-2">
                <label htmlFor="shipping_sender_name" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Nome do remetente
                </label>
                <input
                    id="shipping_sender_name"
                    name="shipping_sender_name"
                    defaultValue={typeof settings.shipping_sender_name === "string" ? settings.shipping_sender_name : ""}
                    placeholder="Nome usado na postagem"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    E-mail do remetente
                </label>
                <input
                    id="shipping_sender_email"
                    name="shipping_sender_email"
                    defaultValue={typeof settings.shipping_sender_email === "string" ? settings.shipping_sender_email : ""}
                    placeholder="contato@loja.com"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_phone" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Telefone do remetente
                </label>
                <input
                    id="shipping_sender_phone"
                    name="shipping_sender_phone"
                    defaultValue={typeof settings.shipping_sender_phone === "string" ? settings.shipping_sender_phone : ""}
                    placeholder="+55 11 90000-0000"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_document" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    CPF ou CNPJ do remetente
                </label>
                <input
                    id="shipping_sender_document"
                    name="shipping_sender_document"
                    defaultValue={typeof settings.shipping_sender_document === "string" ? settings.shipping_sender_document : ""}
                    placeholder="Somente numeros ou formatado"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_address" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Rua do remetente
                </label>
                <input
                    id="shipping_sender_address"
                    name="shipping_sender_address"
                    defaultValue={typeof settings.shipping_sender_address === "string" ? settings.shipping_sender_address : ""}
                    placeholder="Rua ou avenida"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_number" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Numero do remetente
                </label>
                <input
                    id="shipping_sender_number"
                    name="shipping_sender_number"
                    defaultValue={typeof settings.shipping_sender_number === "string" ? settings.shipping_sender_number : ""}
                    placeholder="Ex.: 123"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_district" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Bairro do remetente
                </label>
                <input
                    id="shipping_sender_district"
                    name="shipping_sender_district"
                    defaultValue={typeof settings.shipping_sender_district === "string" ? settings.shipping_sender_district : ""}
                    placeholder="Bairro"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_complement" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Complemento do remetente
                </label>
                <input
                    id="shipping_sender_complement"
                    name="shipping_sender_complement"
                    defaultValue={typeof settings.shipping_sender_complement === "string" ? settings.shipping_sender_complement : ""}
                    placeholder="Sala, loja, referencia"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_city" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Cidade do remetente
                </label>
                <input
                    id="shipping_sender_city"
                    name="shipping_sender_city"
                    defaultValue={typeof settings.shipping_sender_city === "string" ? settings.shipping_sender_city : ""}
                    placeholder="Cidade"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_state" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    UF do remetente
                </label>
                <input
                    id="shipping_sender_state"
                    name="shipping_sender_state"
                    defaultValue={typeof settings.shipping_sender_state === "string" ? settings.shipping_sender_state : ""}
                    placeholder="SP"
                    maxLength={2}
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm uppercase text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="shipping_sender_state_register" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Inscricao estadual
                </label>
                <input
                    id="shipping_sender_state_register"
                    name="shipping_sender_state_register"
                    defaultValue={typeof settings.shipping_sender_state_register === "string" ? settings.shipping_sender_state_register : ""}
                    placeholder="Opcional"
                    className="h-11 w-full rounded-xl border border-zinc-200 px-4 text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                />
            </div>
        </div>
    )
}
