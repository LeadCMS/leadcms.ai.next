import type React from "react"
import { LocaleAwareLayout } from "@/components/locale-aware-layout"

export default function SinhalaLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LocaleAwareLayout locale="si">
      {children}
    </LocaleAwareLayout>
  )
}
