"use client"

import { Search } from "lucide-react"

interface MobileSearchProps {
  onClose: () => void
}

export function MobileSearch({ onClose }: MobileSearchProps) {
  return (
    <form action="/search" onSubmit={onClose} className="mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          name="q"
          placeholder="Buscar produtos"
          className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
      </div>
    </form>
  )
}
