import type React from "react"
import { LocaleAwareLayout } from "@/components/locale-aware-layout"

export default function DanishLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LocaleAwareLayout locale="da">
      {children}
    </LocaleAwareLayout>
  )
}
