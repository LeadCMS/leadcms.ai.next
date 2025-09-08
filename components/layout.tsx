import type * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GitBranch } from "lucide-react"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { FloatingActionButton } from "@/components/ui/floating-action-button"

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* Scroll Progress */}
      <ScrollProgress showPercentage={false} height={3} />

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between max-w-[1750px] mx-auto">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/icon-192x192.png" alt="LeadCMS Logo" className="h-12 w-12" />
              <span className="text-xl font-bold">LeadCMS</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/#features"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Features
              </Link>
              <Link href="/#why" className="text-sm font-medium hover:underline underline-offset-4">
                Why LeadCMS
              </Link>
              <Link
                href="/#compare"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Compare
              </Link>
              <Link
                href="/contact-us"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Contact Us
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/LeadCMS"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-sm font-medium"
              >
                <GitBranch className="h-4 w-4" />
                GitHub
              </a>
              <Button asChild>
                <Link href="#contact">Get Started</Link>
              </Button>
            </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="w-full border-t py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1750px] mx-auto">
            <div className="flex items-center gap-2">
              <img src="/images/icon-192x192.png" alt="LeadCMS Logo" className="h-12 w-12" />
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} LeadCMS. All rights reserved.
              </p>
            </div>
            <nav className="flex gap-6">
              <Link
                href="/legal/terms"
                className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
              >
                Terms
              </Link>
              <Link
                href="/legal/privacy"
                className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
              >
                Privacy
              </Link>
              <a
                href="https://github.com/LeadCMS/leadcms.core"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
              >
                Docs
              </a>
              <a
                href="https://github.com/LeadCMS"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
              >
                GitHub
              </a>
            </nav>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        contactHref="/contact-us"
        showScrollToTop={true}
      />
    </>
  )
}
