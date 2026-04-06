"use client"

import Link from "next/link"
import { Phone } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface MobileNavProps {
  categories: Category[]
  onClose: () => void
}

export function MobileNav({ categories, onClose }: MobileNavProps) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/${cat.slug}`}
          onClick={onClose}
          className="rounded-[1rem] px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {cat.name}
        </Link>
      ))}

      <div className="subtle-divider my-4 h-px w-full bg-border/40" />

      <Link
        href="/sobre"
        onClick={onClose}
        className="rounded-[1rem] px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        Sobre
      </Link>

      <Link
        href="/contato"
        onClick={onClose}
        className="rounded-[1rem] px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          <Phone className="h-4 w-4" /> Contato
        </span>
      </Link>
    </nav>
  )
}
