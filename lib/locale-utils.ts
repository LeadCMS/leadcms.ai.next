/**
 * Client-side utilities for locale handling
 */

// Available locales in the application
export const AVAILABLE_LOCALES = ['en', 'ru', 'da'] as const
export type LocaleCode = typeof AVAILABLE_LOCALES[number]

// Default language from environment or fallback to 'en'
export const DEFAULT_LANGUAGE = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_LEADCMS_DEFAULT_LANGUAGE || "en"

/**
 * Get the current locale from a path
 */
export function getLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 0) {
    const firstSegment = segments[0]
    // Check if the first segment is a known locale
    if (AVAILABLE_LOCALES.includes(firstSegment as LocaleCode)) {
      return firstSegment
    }
  }
  return DEFAULT_LANGUAGE
}

/**
 * Make a link locale-aware by adding the current locale prefix
 */
export function makeLocaleAwareLink(href: string, currentLocale: string): string {
  // Don't modify external links or anchors
  if (href.startsWith('http') || href.startsWith('#')) {
    return href
  }

  // If it's the default language, don't add prefix
  if (currentLocale === DEFAULT_LANGUAGE) {
    return href
  }

  // If the href already starts with the locale, don't double-add it
  if (href.startsWith(`/${currentLocale}/`)) {
    return href
  }

  // Add locale prefix
  return `/${currentLocale}${href.startsWith('/') ? '' : '/'}${href}`
}
