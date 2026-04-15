'use client'

import { FileText } from "lucide-react"
import type { CustomerProfile } from "@/lib/customer-profile"

interface ProfileAddressSectionProps {
    profile: CustomerProfile | null
    metadata: Record<string, string | undefined>
}

export function ProfileAddressSection({ profile, metadata }: ProfileAddressSectionProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
                <label htmlFor="addressStreet" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Rua
                </label>
                <input
                    type="text"
                    id="addressStreet"
                    name="addressStreet"
                    defaultValue={profile?.shippingAddress?.street || metadata.address_street || metadata.address_line1 || ""}
                    placeholder="Rua ou avenida"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="addressNumber" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Número
                </label>
                <input
                    type="text"
                    id="addressNumber"
                    name="addressNumber"
                    defaultValue={profile?.shippingAddress?.number || metadata.address_number || ""}
                    placeholder="Ex.: 123"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="addressNeighborhood" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Bairro
                </label>
                <input
                    type="text"
                    id="addressNeighborhood"
                    name="addressNeighborhood"
                    defaultValue={profile?.shippingAddress?.neighborhood || metadata.address_neighborhood || ""}
                    placeholder="Seu bairro"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2 sm:col-span-2">
                <label htmlFor="addressComplement" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Complemento
                </label>
                <input
                    type="text"
                    id="addressComplement"
                    name="addressComplement"
                    defaultValue={metadata.address_complement || metadata.address_line2 || ""}
                    placeholder="Apartamento, bloco, referência"
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="city" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Cidade
                </label>
                <input
                    type="text"
                    id="city"
                    name="city"
                    defaultValue={profile?.shippingAddress?.city || metadata.city || ""}
                    placeholder="Cidade"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="state" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Estado
                </label>
                <input
                    type="text"
                    id="state"
                    name="state"
                    defaultValue={profile?.shippingAddress?.state || metadata.state || ""}
                    placeholder="UF"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="postalCode" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    CEP
                </label>
                <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    defaultValue={profile?.shippingAddress?.postal_code || metadata.postal_code || ""}
                    placeholder="00000-000"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>
        </div>
    )
}
