import Link from 'next/link'
import { makeLocaleAwareLink, DEFAULT_LANGUAGE } from '@/lib/locale-utils'

interface LocaleAwareLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
  locale?: string
}

export function LocaleAwareLink({
  href,
  children,
  className,
  target,
  rel,
  locale = DEFAULT_LANGUAGE
}: LocaleAwareLinkProps) {
  const localeAwareHref = makeLocaleAwareLink(href, locale)

  // For external links, use regular anchor tag
  if (href.startsWith('http') || target === '_blank') {
    return (
      <a
        href={href}
        className={className}
        target={target}
        rel={rel}
      >
        {children}
      </a>
    )
  }

  // For internal links, use Next.js Link with locale awareness
  return (
    <Link href={localeAwareHref} className={className}>
      {children}
    </Link>
  )
}
