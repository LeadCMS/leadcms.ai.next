import { headers } from 'next/headers'
import { LocaleAwareLayout } from '@/components/locale-aware-layout'
import { getLocaleFromPath, DEFAULT_LANGUAGE } from '@/lib/locale-utils'
import type * as React from "react"

interface LocaleAwareLayoutWrapperProps {
  children: React.ReactNode
}

export const LocaleAwareLayoutWrapper: React.FC<LocaleAwareLayoutWrapperProps> = async ({ children }) => {
  // Get the current pathname from headers
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-url') || '/'
  const locale = getLocaleFromPath(pathname)

  return (
    <LocaleAwareLayout locale={locale}>
      {children}
    </LocaleAwareLayout>
  )
}
