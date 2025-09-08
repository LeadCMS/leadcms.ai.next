"use client"

import * as React from "react"
import { Menu, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { LocaleAwareLink } from "@/components/locale-aware-link"
import { LanguageSwitcher } from "@/components/language-switcher"
import type { HeaderConfig, FooterConfig } from "@/lib/layout-config"

interface LocaleAwareMobileNavProps {
  locale: string
  headerConfig: HeaderConfig
  footerConfig?: FooterConfig
}

export const LocaleAwareMobileNav: React.FC<LocaleAwareMobileNavProps> = ({
  locale,
  headerConfig,
  footerConfig
}) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-6">
          {headerConfig.headerData.navigation.map((item, index) => (
            <SheetClose key={index} asChild>
              <LocaleAwareLink
                href={item.href}
                locale={locale}
                className="text-sm font-medium hover:underline underline-offset-4 py-2"
              >
                {item.label}
              </LocaleAwareLink>
            </SheetClose>
          ))}

          <div className="border-t pt-4 mt-4">
            {headerConfig.headerData.externalLinks.map((link, index) => (
              <SheetClose key={index} asChild>
                <LocaleAwareLink
                  href={link.href}
                  locale={locale}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium py-2"
                >
                  {link.icon === 'github' && <GitBranch className="h-4 w-4" />}
                  {link.label}
                </LocaleAwareLink>
              </SheetClose>
            ))}
          </div>

          <div className="mt-4">
            <SheetClose asChild>
              <Button asChild className="w-full">
                <LocaleAwareLink href={headerConfig.headerData.cta.href} locale={locale}>
                  {headerConfig.headerData.cta.label}
                </LocaleAwareLink>
              </Button>
            </SheetClose>
          </div>

          {footerConfig?.footerData.languages && footerConfig.footerData.languages.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm font-medium text-muted-foreground mb-2">Language</div>
              <LanguageSwitcher
                languages={footerConfig.footerData.languages}
                variant="compact"
                align="start"
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
