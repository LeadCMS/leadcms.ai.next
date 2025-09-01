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

// Default available locales (fallback if not provided via props)
const DEFAULT_LOCALES: LanguageConfig[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
]

export interface LanguageConfig {
  code: string
  name: string
  flag: string
  displayName?: string
}

interface LanguageSwitcherProps {
  languages?: LanguageConfig[]
  variant?: 'default' | 'compact' | 'header' | 'footer'
  align?: 'start' | 'center' | 'end'
}

export function LanguageSwitcher({
  languages = DEFAULT_LOCALES,
  variant = 'default',
  align = 'end'
}: LanguageSwitcherProps) {
  const currentLocale = useLocale()
  const pathname = usePathname()

  // Find current locale info
  const currentLocaleInfo = languages.find(locale => locale.code === currentLocale) || languages[0]

  // Function to generate URL for a different locale
  const getLocalizedUrl = (targetLocale: string): string => {
    // Remove current locale prefix from pathname if it exists
    let cleanPath = pathname
    for (const locale of languages) {
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

  const handleLocaleChange = (targetLocale: string) => {
    const newUrl = getLocalizedUrl(targetLocale)
    window.location.href = newUrl
  }

  // Different variants for different contexts
  const getButtonStyles = () => {
    switch (variant) {
      case 'compact':
        return "gap-1 text-xs text-muted-foreground hover:text-foreground h-8 px-2"
      case 'header':
        return "gap-2 text-sm text-foreground hover:text-muted-foreground h-9 px-3"
      case 'footer':
        return "gap-1 text-xs text-muted-foreground hover:text-foreground h-7 px-2"
      default:
        return "gap-2 text-muted-foreground hover:text-foreground"
    }
  }

  const showFullName = variant !== 'compact' && variant !== 'footer'
  const showGlobeIcon = variant !== 'header' && variant !== 'footer'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={getButtonStyles()}>
          {showGlobeIcon && <Globe className="h-4 w-4" />}
          <span className={variant === 'compact' ? 'inline-flex items-center gap-1' : 'hidden sm:inline-flex items-center gap-1'}>
            <span>{currentLocaleInfo.flag}</span>
            {showFullName && <span>{currentLocaleInfo.displayName || currentLocaleInfo.name}</span>}
          </span>
          {variant === 'compact' && (
            <span className="sm:hidden">{currentLocaleInfo.flag}</span>
          )}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[150px]">
        {languages.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLocaleChange(locale.code)}
            className={`cursor-pointer flex items-center gap-2 ${
              locale.code === currentLocale ? 'bg-accent' : ''
            }`}
          >
            <span>{locale.flag}</span>
            <span>{locale.displayName || locale.name}</span>
            {locale.code === currentLocale && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
