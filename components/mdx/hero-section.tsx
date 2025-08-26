import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { GitBranch } from "lucide-react"

export interface HeroSectionProps {
  badge: string
  title: string
  description: string
  image: string
  primaryButton: { label: string; href: string }
  secondaryButton: { label: string; href: string }
  dashboardLabel: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  badge,
  title,
  description,
  image,
  primaryButton,
  secondaryButton,
  dashboardLabel,
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-background to-muted">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 items-center">
        <div className="flex flex-col items-start">
          <Badge className="mb-4" variant="outline">
            {badge}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">{title}</h1>
          <p className="mt-6 text-lg text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Button asChild size="lg">
              <Link href={primaryButton.href}>{primaryButton.label}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={secondaryButton.href} target="_blank" rel="noopener noreferrer">
                <GitBranch className="mr-2 h-4 w-4" />
                {secondaryButton.label}
              </a>
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="relative w-full max-w-full overflow-hidden rounded-xl border bg-background shadow-xl flex flex-col">
            <div className="h-8 bg-muted rounded-t-lg flex items-center gap-2 px-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="text-xs text-muted-foreground ml-2">{dashboardLabel}</div>
            </div>
            <img
              src={image || "/placeholder.svg"}
              alt={dashboardLabel}
              className="w-full rounded-b-xl"
              style={{ display: "block" }}
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full z-[-1]"></div>
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full z-[-1]"></div>
        </div>
      </div>
    </div>
  </section>
)
