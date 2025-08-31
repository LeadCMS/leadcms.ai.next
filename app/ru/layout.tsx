import type React from "react"
import { LocaleAwareLayout } from "@/components/locale-aware-layout"

export default function RussianLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LocaleAwareLayout locale="ru">
      {children}
    </LocaleAwareLayout>
  )
}
