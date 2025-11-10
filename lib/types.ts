/**
 * Shared types for Next.js page components
 */

/**
 * Standard page props for dynamic routes with required params
 * Used by: [...slug]/page.tsx and locale-specific dynamic pages
 */
export interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Locale-specific page props that include locale parameter
 * For future use with locale-specific pages that need locale in params
 */
export interface LocalePageProps {
  params: Promise<{ locale?: string; slug?: string[] }>;
}
