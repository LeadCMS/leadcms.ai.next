"use client"

import { useEffect } from "react"
import { setDocsData } from "@/components/locale-aware-mobile-nav"

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

interface DocMobileNavProviderProps {
  children: React.ReactNode
  currentSlug: string
  docGroups: DocGroup[]
}

export function DocMobileNavProvider({ children, currentSlug, docGroups }: DocMobileNavProviderProps) {
  useEffect(() => {
    setDocsData(docGroups, currentSlug)
  }, [currentSlug, docGroups])

  return <>{children}</>
}
