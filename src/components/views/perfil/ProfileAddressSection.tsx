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
                <label htmlFor="addressLine1" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Endereço
                </label>
                <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    defaultValue={profile?.shippingAddress?.line1 || metadata.address_line1 || ""}
                    placeholder="Rua, número e complemento principal"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2 sm:col-span-2">
                <label htmlFor="addressLine2" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Complemento
                </label>
                <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    defaultValue={profile?.shippingAddress?.line2 || metadata.address_line2 || ""}
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
