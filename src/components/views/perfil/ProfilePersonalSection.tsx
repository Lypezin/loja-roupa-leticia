'use client'

import { Mail, Phone, User, FileText } from "lucide-react"
import type { CustomerProfile } from "@/lib/customer-profile"

interface ProfilePersonalSectionProps {
    profile: CustomerProfile | null
    email: string
}

export function ProfilePersonalSection({ profile, email }: ProfilePersonalSectionProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
                <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nome completo
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    defaultValue={profile?.fullName || ""}
                    placeholder="Seu nome completo"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Telefone
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    defaultValue={profile?.phone || ""}
                    placeholder="+55 11 90000-0000"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="cpf" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    CPF
                </label>
                <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    defaultValue={profile?.cpf || ""}
                    placeholder="000.000.000-00"
                    required
                    className="h-12 w-full rounded-[1rem] border border-border bg-background px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
            </div>

            <div className="space-y-2 sm:col-span-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    E-mail
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    disabled
                    className="h-12 w-full rounded-[1rem] border border-border bg-muted px-4 text-muted-foreground"
                />
            </div>
        </div>
    )
}
