import React from "react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { GitBranch } from "lucide-react"
import { FadeIn, ScaleIn, FloatingElement } from "@/components/ui/animated-elements"
import { DynamicIcon } from "@/lib/dynamic-icon"
import { getTextContent } from "@/lib/mdx-utils"

export interface HeroSectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
}

export interface HeroBadgeProps {
  children: React.ReactNode
}

export interface HeroTitleProps {
  children: React.ReactNode
}

export interface HeroDescriptionProps {
  children: React.ReactNode
}

export interface HeroButtonProps {
  href: string
  variant?: "default" | "outline"
  icon?: string
  external?: boolean
  children: React.ReactNode
}

export const HeroBadge: React.FC<HeroBadgeProps> = ({ children }) => (
  <FadeIn direction="up" delay={0.1}>
    <Badge className="mb-4 bg-primary text-primary-foreground border-0" variant="outline">
      {children}
    </Badge>
  </FadeIn>
)

export const HeroTitle: React.FC<HeroTitleProps> = ({ children }) => {
  const textContent = getTextContent(children)
  return (
    <FadeIn direction="up" delay={0.2}>
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
        {textContent}
      </h1>
    </FadeIn>
  )
}

export const HeroDescription: React.FC<HeroDescriptionProps> = ({ children }) => {
  const textContent = getTextContent(children)

  return (
    <FadeIn direction="up" delay={0.3}>
      <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">{textContent}</p>
    </FadeIn>
  )
}

export const HeroButton: React.FC<HeroButtonProps> = ({
  href,
  variant = "default",
  icon,
  external = false,
  children,
}) => {
  const isExternal = external || href.startsWith("http")
  const textContent = getTextContent(children)

  const buttonElement = (
    <AnimatedButton
      size="lg"
      variant={variant}
      animation={variant === "outline" ? "scale" : "glow"}
      className={variant === "outline" ? "border-2" : ""}
    >
      {icon && <DynamicIcon name={icon} className="mr-2 h-4 w-4" />}
      {textContent}
    </AnimatedButton>
  )

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {buttonElement}
    </a>
  ) : (
    <Link href={href}>{buttonElement}</Link>
  )
}

export const HeroButtons: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FadeIn direction="up" delay={0.4}>
    <div className="flex flex-wrap gap-4 mt-8">{children}</div>
  </FadeIn>
)

export interface HeroPreviewProps {
  image: string
  label?: string
}

export const HeroPreview: React.FC<HeroPreviewProps> = ({ image, label }) => (
  <ScaleIn delay={0.5} className="relative max-w-2xl lg:max-w-none">
    <div className="relative w-full max-w-full overflow-hidden rounded-xl border bg-background shadow-xl flex flex-col backdrop-blur-sm">
      {label && (
        <div className="h-8 bg-muted rounded-t-lg flex items-center gap-2 px-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-100"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-200"></div>
          <div className="text-xs text-muted-foreground ml-2">{label}</div>
        </div>
      )}
      <img
        src={image || "/placeholder.svg"}
        alt={label || "Preview"}
        className={label ? "w-full rounded-b-xl" : "w-full rounded-xl"}
      />
    </div>
    <FloatingElement
      intensity={0.5}
      duration={4}
      className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full z-[-1] blur-xl"
    >
      <div />
    </FloatingElement>
    <FloatingElement
      intensity={0.3}
      duration={6}
      className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full z-[-1] blur-xl"
    >
      <div />
    </FloatingElement>
    <FloatingElement
      intensity={0.4}
      duration={5}
      className="absolute top-1/2 -right-8 w-16 h-16 bg-accent/10 rounded-full z-[-1] blur-lg"
    >
      <div />
    </FloatingElement>
  </ScaleIn>
)

export const HeroSection: React.FC<HeroSectionProps> = ({ title, description, children }) => {
  let titleText = typeof title === "string" ? title : title ? getTextContent(title) : null
  let descriptionText =
    typeof description === "string" ? description : description ? getTextContent(description) : null

  const childArray = React.Children.toArray(children)

  const matchesComponent = (
    child: React.ReactNode,
    component: React.ComponentType<any>,
    mdxName: string
  ): child is React.ReactElement => {
    if (!React.isValidElement(child)) {
      return false
    }

    if (child.type === component) {
      return true
    }

    const mdxType = (child.props as any)?.mdxType
    return mdxType === mdxName
  }

  let badgeChild: React.ReactElement | null = null
  const previewChild = childArray.find((child) =>
    matchesComponent(child, HeroPreview, "HeroPreview")
  )
  const contentChildren: React.ReactNode[] = []

  childArray.forEach((child) => {
    if (matchesComponent(child, HeroPreview, "HeroPreview")) {
      return
    }

    if (!badgeChild && matchesComponent(child, HeroBadge, "HeroBadge")) {
      badgeChild = child
      return
    }

    if (!titleText && matchesComponent(child, HeroTitle, "HeroTitle")) {
      titleText = getTextContent((child.props as any)?.children ?? child)
      return
    }

    if (!descriptionText && matchesComponent(child, HeroDescription, "HeroDescription")) {
      descriptionText = getTextContent((child.props as any)?.children ?? child)
      return
    }

    contentChildren.push(child)
  })

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 dark:from-primary/10 dark:via-primary/5 dark:to-accent/5 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800/[0.04] bg-[size:32px_32px]" />
      <div className="absolute h-full w-full bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1750px] mx-auto">
          <div
            className={`grid gap-12 items-center lg:gap-16 ${previewChild ? "lg:grid-cols-2" : ""}`}
          >
            <div className="flex flex-col items-start max-w-2xl">
              {badgeChild}
              {titleText && (
                <FadeIn direction="up" delay={0.2}>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                    {titleText}
                  </h1>
                </FadeIn>
              )}
              {descriptionText && (
                <FadeIn direction="up" delay={titleText ? 0.3 : 0.2}>
                  <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
                    {descriptionText}
                  </p>
                </FadeIn>
              )}
              {contentChildren}
            </div>
            {previewChild}
          </div>
        </div>
      </div>
    </section>
  )
}
