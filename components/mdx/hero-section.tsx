import type React from "react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { GitBranch } from "lucide-react"
import { FadeIn, ScaleIn, FloatingElement } from "@/components/ui/animated-elements"

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
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 dark:from-primary/10 dark:via-primary/5 dark:to-accent/5 overflow-hidden relative">
    {/* Decorative background elements */}
    <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800/[0.04] bg-[size:32px_32px]" />
    <div className="absolute h-full w-full bg-gradient-to-t from-background/80 via-transparent to-transparent" />

    <div className="relative w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1750px] mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 items-center lg:gap-16">
          <div className="flex flex-col items-start max-w-2xl">
            <FadeIn direction="up" delay={0.1}>
              <Badge className="mb-4 bg-primary text-primary-foreground border-0" variant="outline">
                {badge}
              </Badge>
            </FadeIn>
            <FadeIn direction="up" delay={0.2}>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                {title}
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
                {description}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.4}>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href={primaryButton.href}
                  target={primaryButton.href.startsWith("http") ? "_blank" : undefined}
                  rel={primaryButton.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <AnimatedButton size="lg" animation="glow">
                    {primaryButton.label}
                  </AnimatedButton>
                </Link>
                <a href={secondaryButton.href} target="_blank" rel="noopener noreferrer">
                  <AnimatedButton variant="outline" size="lg" animation="scale" className="border-2">
                    <GitBranch className="mr-2 h-4 w-4" />
                    {secondaryButton.label}
                  </AnimatedButton>
                </a>
              </div>
            </FadeIn>
          </div>
          <ScaleIn delay={0.5} className="relative max-w-2xl lg:max-w-none">
            <div className="relative w-full max-w-full overflow-hidden rounded-xl border bg-background shadow-xl flex flex-col backdrop-blur-sm">
              <div className="h-8 bg-muted rounded-t-lg flex items-center gap-2 px-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-100"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-200"></div>
                <div className="text-xs text-muted-foreground ml-2">{dashboardLabel}</div>
              </div>
              <img
                src={image || "/placeholder.svg"}
                alt={dashboardLabel}
                className="w-full rounded-b-xl"
              />
            </div>
            <FloatingElement intensity={0.5} duration={4} className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full z-[-1] blur-xl">
              <div />
            </FloatingElement>
            <FloatingElement intensity={0.3} duration={6} className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full z-[-1] blur-xl">
              <div />
            </FloatingElement>
            <FloatingElement intensity={0.4} duration={5} className="absolute top-1/2 -right-8 w-16 h-16 bg-accent/10 rounded-full z-[-1] blur-lg">
              <div />
            </FloatingElement>
          </ScaleIn>
        </div>
      </div>
    </div>
  </section>
)
