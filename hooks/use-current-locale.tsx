import { getLocaleFromPath } from '@/lib/locale-utils'

/**
 * Server-side utility to get current locale from pathname
 * For use in server components that have access to pathname
 */
export function getCurrentLocaleFromPath(pathname: string): string {
  return getLocaleFromPath(pathname)
}

/**
 * @deprecated Use getCurrentLocaleFromPath instead for server components
 * This hook should only be used in client components if absolutely necessary
 */
export function useCurrentLocale(): string {
  throw new Error('useCurrentLocale hook is deprecated. Use getCurrentLocaleFromPath for server components or pass locale as props.')
}
