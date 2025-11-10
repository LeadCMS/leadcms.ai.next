import React from "react"
import { AnimatedCard, AnimatedCardHeader, AnimatedCardContent } from "@/components/ui/animated-card"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated-elements"
import { DynamicIcon } from "@/lib/dynamic-icon"
import { getTextContent } from "@/lib/mdx-utils"

export interface FeaturesSectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
}

export interface FeaturesCardProps {
  icon?: string
  title: string
  children: React.ReactNode
}

export interface FeatureBulletProps {
  children: React.ReactNode
}

export const FeaturesSectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const textContent = getTextContent(children)
  return (
    <FadeIn direction="up">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        {textContent}
      </h2>
    </FadeIn>
  )
}

export const FeaturesSectionDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const textContent = getTextContent(children)
  return (
    <FadeIn direction="up" delay={0.2}>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
        {textContent}
      </p>
    </FadeIn>
  )
}

export const FeaturesSectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="text-center mb-16">
      {children}
    </div>
  )
}

export const FeatureBullet: React.FC<FeatureBulletProps> = ({ children }) => {
  const textContent = getTextContent(children)
  return (
    <li className="flex items-center group/item">
      <CheckCircle className="mr-3 h-4 w-4 text-primary group-hover/item:scale-110 transition-transform duration-200 flex-shrink-0" />
      <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">
        {textContent}
      </span>
    </li>
  )
}

export const FeaturesCard: React.FC<FeaturesCardProps> = ({ icon, title, children }) => {
  const titleText = getTextContent(title)

  return (
    <StaggerItem>
      <AnimatedCard
        hoverEffect="lift"
        className="relative overflow-hidden border-2 border-primary/20 group"
      >
        <AnimatedCardHeader className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl font-semibold flex-1 pr-3">{titleText}</CardTitle>
            {icon && (
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                <DynamicIcon name={icon} className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
          <CardDescription className="text-muted-foreground">
            {children}
          </CardDescription>
        </AnimatedCardHeader>
      </AnimatedCard>
    </StaggerItem>
  )
}

export const FeaturesCardWithBullets: React.FC<FeaturesCardProps> = ({ icon, title, children }) => {
  const titleText = getTextContent(title)

  const childArray = React.Children.toArray(children)
  let description: React.ReactNode = null
  const bulletItems: React.ReactNode[] = []

  const matchesTag = (element: React.ReactElement, tag: string) => {
    if (typeof element.type === 'string') {
      return element.type.toLowerCase() === tag
    }

    const props = element.props as any
    if (typeof props?.mdxType === 'string') {
      return props.mdxType.toLowerCase() === tag
    }

    const displayName = (element.type as any)?.displayName
    if (typeof displayName === 'string') {
      return displayName.toLowerCase() === tag
    }

    const name = (element.type as any)?.name
    if (typeof name === 'string') {
      return name.toLowerCase() === tag
    }

    return false
  }

  childArray.forEach(child => {
    if (!React.isValidElement(child)) {
      return
    }

    if (!description && matchesTag(child, 'p')) {
      const paragraphChildren = (child.props as any)?.children
      description = (
        <CardDescription className="text-muted-foreground">
          {typeof paragraphChildren === 'string' ? paragraphChildren : getTextContent(child)}
        </CardDescription>
      )
      return
    }

    if (matchesTag(child, 'ul')) {
      const listChildren = React.Children.toArray((child.props as any)?.children)

      listChildren.forEach(liChild => {
        if (!React.isValidElement(liChild)) {
          return
        }

        if (!matchesTag(liChild, 'li')) {
          return
        }

        const liChildren = (liChild.props as any)?.children
        const liText = typeof liChildren === 'string'
          ? liChildren
          : getTextContent(liChild)

        if (!liText || !liText.trim()) {
          return
        }

        bulletItems.push(
          <li key={liText} className="flex items-center group/item">
            <CheckCircle className="mr-3 h-4 w-4 text-primary group-hover/item:scale-110 transition-transform duration-200 flex-shrink-0" />
            <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">
              {liText.trim()}
            </span>
          </li>
        )
      })
      return
    }

    if (child.type === FeatureBullet) {
      bulletItems.push(child)
    }
  })

  return (
    <StaggerItem>
      <AnimatedCard
        hoverEffect="lift"
        className="relative overflow-hidden border-2 border-primary/20 group"
      >
        <AnimatedCardHeader className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl font-semibold flex-1 pr-3">{titleText}</CardTitle>
            {icon && (
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
                <DynamicIcon name={icon} className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
          {description}
        </AnimatedCardHeader>
        {bulletItems.length > 0 && (
          <AnimatedCardContent>
            <ul className="space-y-3 text-sm">
              {bulletItems}
            </ul>
          </AnimatedCardContent>
        )}
      </AnimatedCard>
    </StaggerItem>
  )
}

export const FeaturesSectionCards: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StaggerContainer className="grid gap-8 md:grid-cols-3" staggerDelay={0.1}>
      {children}
    </StaggerContainer>
  )
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ title, description, children }) => {
  const titleText = typeof title === 'string' ? title : title ? getTextContent(title) : null
  const descriptionText = typeof description === 'string' ? description : description ? getTextContent(description) : null

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="features">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1750px] mx-auto">
          {(titleText || descriptionText) && (
            <div className="text-center mb-16">
              {titleText && (
                <FadeIn direction="up">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {titleText}
                  </h2>
                </FadeIn>
              )}
              {descriptionText && (
                <FadeIn direction="up" delay={0.2}>
                  <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    {descriptionText}
                  </p>
                </FadeIn>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  )
}
