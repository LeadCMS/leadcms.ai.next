'use client'

import * as React from "react"
import { usePathname } from "next/navigation"
import { Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocale } from "@/lib/locale-context"
import { DEFAULT_LANGUAGE } from "@/lib/locale-utils"

// Define available locales with their display names and flags
const AVAILABLE_LOCALES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
] as const

type LocaleCode = typeof AVAILABLE_LOCALES[number]['code']

export function LanguageSwitcher() {
  const currentLocale = useLocale()
  const pathname = usePathname()

  // Find current locale info
  const currentLocaleInfo = AVAILABLE_LOCALES.find(locale => locale.code === currentLocale) || AVAILABLE_LOCALES[0]

  // Function to generate URL for a different locale
  const getLocalizedUrl = (targetLocale: LocaleCode): string => {
    // Remove current locale prefix from pathname if it exists
    let cleanPath = pathname
    for (const locale of AVAILABLE_LOCALES) {
      if (pathname.startsWith(`/${locale.code}/`)) {
        cleanPath = pathname.replace(`/${locale.code}`, '')
        break
      }
    }

    // If the target locale is the default language, don't add prefix
    if (targetLocale === DEFAULT_LANGUAGE) {
      return cleanPath || '/'
    }

    // Add the target locale prefix
    return `/${targetLocale}${cleanPath || ''}`
  }

  const handleLocaleChange = (targetLocale: LocaleCode) => {
    const newUrl = getLocalizedUrl(targetLocale)
    window.location.href = newUrl
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-flex items-center gap-1">
            <span>{currentLocaleInfo.flag}</span>
            <span>{currentLocaleInfo.name}</span>
          </span>
          <span className="sm:hidden">{currentLocaleInfo.flag}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {AVAILABLE_LOCALES.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className={`cursor-pointer flex items-center gap-2 ${
              locale.code === currentLocale ? 'bg-accent' : ''
            }`}
          >
            <span>{locale.flag}</span>
            <span>{locale.name}</span>
            {locale.code === currentLocale && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}