"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Book, FileText } from "lucide-react"

interface DocItem {
  slug: string
  title: string
  group: string
  order: number
  description?: string
}

interface DocGroup {
  name: string
  items: DocItem[]
  order: number
}

interface DocNavigationClientProps {
  docGroups: DocGroup[]
  currentSlug: string
}

export function DocNavigationClient({ docGroups, currentSlug }: DocNavigationClientProps) {
  const pathname = usePathname()

  return (
    <div className="h-full overflow-y-auto">
      <nav className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Book className="h-5 w-5" />
            <h2 className="font-semibold">Documentation</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete guide to using LeadCMS
          </p>
        </div>

        <div className="space-y-6">
          {docGroups.map((group) => (
            <div key={group.name}>
              <h3 className="text-sm font-medium text-foreground mb-3">
                {group.name}
              </h3>

              <div className="space-y-1">
                {group.items.map((item) => {
                  // The slug already contains the full path (e.g., 'docs/getting-started')
                  const isActive = currentSlug === item.slug || pathname === `/${item.slug}`
                  const href = `/${item.slug}`

                  return (
                    <Link
                      key={item.slug}
                      href={href}
                      className={cn(
                        "flex items-center gap-2 p-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ml-3 border-l-2 border-transparent",
                        isActive && "bg-accent text-accent-foreground font-medium border-l-primary"
                      )}
                    >
                      <FileText className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  )
}
