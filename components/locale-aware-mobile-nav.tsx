"use client"

import * as React from "react"
import { Menu, GitBranch, Book, FileText, ChevronDown, ChevronRight } from "lucide-react"
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
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import type { HeaderConfig, FooterConfig } from "@/lib/layout-config"

interface DocItem {
  slug: string
  title: string
  group: string
  order: number
  description?: string
}

interface DocGroup {
  name: string
  items: DocItem[]
  order: number
}

interface LocaleAwareMobileNavProps {
  locale?: string
  headerConfig: HeaderConfig
  footerConfig: FooterConfig
}

// This will be populated by the DocNavigationProvider when on docs pages
let globalDocsData: DocGroup[] = []
let currentDocSlug = ""

export const setDocsData = (docGroups: DocGroup[], currentSlug: string) => {
  globalDocsData = docGroups
  currentDocSlug = currentSlug
}

export const LocaleAwareMobileNav: React.FC<LocaleAwareMobileNavProps> = ({
  locale,
  headerConfig,
  footerConfig
}) => {
  const [open, setOpen] = React.useState(false)
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set())
  const pathname = usePathname()

  // Check if we're on a docs page
  const isDocsPage = pathname.includes('/docs') || currentDocSlug.includes('docs')

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedGroups(newExpanded)
  }

  // Auto-expand groups that contain the current page
  React.useEffect(() => {
    if (isDocsPage && globalDocsData.length > 0) {
      const currentGroup = globalDocsData.find(group =>
        group.items.some(item => item.slug === currentDocSlug || pathname === `/${item.slug}`)
      )
      if (currentGroup) {
        setExpandedGroups(prev => new Set([...prev, currentGroup.name]))
      }
    }
  }, [currentDocSlug, pathname, isDocsPage])

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
      <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 mt-6">
          {/* General Navigation */}
          <div className="space-y-2">
            {headerConfig.headerData.navigation.map((item, index) => (
              <SheetClose key={index} asChild>
                <LocaleAwareLink
                  href={item.href}
                  locale={locale}
                  className="block text-sm font-medium hover:underline underline-offset-4 py-2"
                >
                  {item.label}
                </LocaleAwareLink>
              </SheetClose>
            ))}
          </div>

          {/* Documentation Navigation - Only show if we have docs or are on a docs page */}
          {(isDocsPage || globalDocsData.length > 0) && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Book className="h-5 w-5" />
                <h3 className="font-semibold">Documentation</h3>
              </div>

              {globalDocsData.length > 0 ? (
                <div className="space-y-2">
                  {globalDocsData.map((group) => (
                    <div key={group.name}>
                      <button
                        onClick={() => toggleGroup(group.name)}
                        className="flex items-center justify-between w-full text-left text-sm font-medium py-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2"
                      >
                        <span>{group.name}</span>
                        {expandedGroups.has(group.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {expandedGroups.has(group.name) && (
                        <div className="ml-4 space-y-1">
                          {group.items.map((item) => {
                            const isActive = currentDocSlug === item.slug || pathname === `/${item.slug}`
                            const href = `/${item.slug}`

                            return (
                              <SheetClose key={item.slug} asChild>
                                <LocaleAwareLink
                                  href={href}
                                  locale={locale}
                                  className={cn(
                                    "flex items-center gap-2 p-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground border-l-2 border-transparent",
                                    isActive && "bg-accent text-accent-foreground font-medium border-l-primary"
                                  )}
                                >
                                  <FileText className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{item.title}</span>
                                </LocaleAwareLink>
                              </SheetClose>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground ml-2">
                  No documentation available
                </div>
              )}
            </div>
          )}

          {/* External Links */}
          <div className="border-t pt-4">
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

          {/* CTA Button */}
          <div className="mt-4">
            <SheetClose asChild>
              <Button asChild className="w-full">
                <LocaleAwareLink href={headerConfig.headerData.cta.href} locale={locale}>
                  {headerConfig.headerData.cta.label}
                </LocaleAwareLink>
              </Button>
            </SheetClose>
          </div>

          {/* Language Switcher */}
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
