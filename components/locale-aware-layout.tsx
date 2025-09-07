import type * as React from "react"
import { Button } from "@/components/ui/button"
import { GitBranch } from "lucide-react"
import { LocaleAwareLink } from "@/components/locale-aware-link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getLayoutConfig, type HeaderConfig, type FooterConfig } from "@/lib/layout-config"
import { DEFAULT_LANGUAGE } from "@/lib/locale-utils"
import { LocaleProvider } from "@/lib/locale-context"

interface LocaleAwareLayoutProps {
  children: React.ReactNode
  locale?: string
}

export const LocaleAwareLayout: React.FC<LocaleAwareLayoutProps> = ({ children, locale = DEFAULT_LANGUAGE }) => {
  // Load configuration at build time
  const { header: headerConfig, footer: footerConfig } = getLayoutConfig(locale)

  return (
    <LocaleProvider locale={locale}>
      <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between w-full px-4 sm:px-6 lg:px-8">
          <LocaleAwareLink href={headerConfig.headerData.logo.href} locale={locale} className="flex items-center gap-2">
            <img
              src={headerConfig.headerData.logo.src}
              alt={headerConfig.headerData.logo.alt}
              className="h-12 w-12"
            />
            <span className="text-xl font-bold">{headerConfig.headerData.logo.text}</span>
          </LocaleAwareLink>

          <nav className="hidden md:flex gap-6">
            {headerConfig.headerData.navigation.map((item, index) => (
              <LocaleAwareLink
                key={index}
                href={item.href}
                locale={locale}
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                {item.label}
              </LocaleAwareLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {headerConfig.headerData.externalLinks.map((link, index) => (
              <LocaleAwareLink
                key={index}
                href={link.href}
                locale={locale}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-sm font-medium"
              >
                {link.icon === 'github' && <GitBranch className="h-4 w-4" />}
                {link.label}
              </LocaleAwareLink>
            ))}
            <Button asChild>
              <LocaleAwareLink href={headerConfig.headerData.cta.href} locale={locale}>
                {headerConfig.headerData.cta.label}
              </LocaleAwareLink>
            </Button>
          </div>
        </div>
      </header>

      {children}

      <footer className="w-full border-t py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <img
              src={footerConfig.footerData.logo.src}
              alt={footerConfig.footerData.logo.alt}
              className="h-12 w-12"
            />
            <p className="text-sm text-muted-foreground">
              {footerConfig.footerData.copyright.text.replace(
                '{year}',
                footerConfig.footerData.copyright.showYear ? new Date().getFullYear().toString() : ''
              )}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <LanguageSwitcher
              languages={footerConfig.footerData.languages}
              variant="footer"
              align="end"
            />
            <nav className="flex gap-6">
              {footerConfig.footerData.navigation.map((item, index) => (
                <LocaleAwareLink
                  key={index}
                  href={item.href}
                  locale={locale}
                  className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
                >
                  {item.label}
                </LocaleAwareLink>
              ))}
              {footerConfig.footerData.externalLinks.map((link, index) => (
                <LocaleAwareLink
                  key={`external-${index}`}
                  href={link.href}
                  locale={locale}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
                >
                  {link.label}
                </LocaleAwareLink>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </div>
    </LocaleProvider>
  )
}
