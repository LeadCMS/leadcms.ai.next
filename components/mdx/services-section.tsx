import React from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animated-elements"
import { DynamicIcon } from "@/lib/dynamic-icon"
import { cn } from "@/lib/utils"
import { getTextContent } from "@/lib/mdx-utils"

export interface ServicesSectionProps {
  title: string
  description: string
  servicesTitle: string
  variant?: "surface" | "muted" | "soft" | "gradient"
  children: React.ReactNode
}

export interface ServiceCardProps {
  icon: string
  title: string
  children: React.ReactNode
}

export interface ServiceListProps {
  children: React.ReactNode
}

export interface ServiceButtonProps {
  href: string
  children: React.ReactNode
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, children }) => {
  const description = getTextContent(children)

  return (
    <div className="flex items-start gap-4 group">
      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
        <DynamicIcon name={icon} className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export const ServiceList: React.FC<ServiceListProps> = ({ children }) => {
  // MDX parses markdown lists into React elements
  // In RSC context, we need to handle both direct string content and nested structure
  const childrenArray = React.Children.toArray(children)

  // First, try to extract from structured <ul><li> elements
  const ulElement = childrenArray.find(child =>
    React.isValidElement(child) && (
      (child.type as any) === 'ul' ||
      (typeof child.type === 'function' && (child.type as any).name === 'ul') ||
      (typeof child.type === 'object' && (child.type as any)?.$$typeof === Symbol.for('react.lazy'))
    )
  )

  let items: string[] = []

  if (ulElement && React.isValidElement(ulElement)) {
    const ulProps = ulElement.props as { children?: React.ReactNode }
    if (ulProps.children) {
      const liElements = React.Children.toArray(ulProps.children).filter(child =>
        React.isValidElement(child)
      )

      items = liElements.map(liChild => {
        if (React.isValidElement(liChild)) {
          const liProps = liChild.props as { children?: React.ReactNode }
          return getTextContent(liProps.children)
        }
        return null
      }).filter(Boolean) as string[]
    }
  }

  // Fallback: try to parse as plain text with bullet points
  if (items.length === 0) {
    const textContent = getTextContent(children)
    items = textContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('*') || line.startsWith('-'))
      .map(line => line.replace(/^[*-]\s*/, ''))
      .filter(Boolean)
  }

  return (
    <ul className="space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-center group">
          <CheckCircle className="mr-3 h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export const ServiceButton: React.FC<ServiceButtonProps> = ({ href, children }) => {
  const label = getTextContent(children)

  return (
    <Button asChild className="w-full mt-8">
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {label}
      </Link>
    </Button>
  )
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  title,
  description,
  servicesTitle,
  variant = "surface",
  children,
}) => {
  const backgroundClasses: Record<NonNullable<ServicesSectionProps["variant"]>, string> = {
    surface: "bg-background",
    muted: "bg-muted dark:bg-slate-900",
    soft: "bg-primary/5 dark:bg-primary/10",
    gradient: "bg-gradient-to-b from-muted/50 via-background to-background dark:from-slate-900/50",
  }

  const childrenArray = React.Children.toArray(children)
  const services = childrenArray.filter(
    (child) => React.isValidElement(child) && child.type === ServiceCard
  )
  const serviceList = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === ServiceList
  )
  const button = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === ServiceButton
  )

  return (
    <section className={cn("w-full py-12 md:py-24 lg:py-32", backgroundClasses[variant])} id="services">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 items-center max-w-[1750px] mx-auto">
          <FadeIn direction="left">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{title}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{description}</p>
              <StaggerContainer delay={0.3}>
                <div className="mt-8 space-y-6">
                  {services.map((service, idx) => (
                    <StaggerItem key={idx}>{service}</StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            </div>
          </FadeIn>
          <ScaleIn direction="right" delay={0.4}>
            <div className="bg-muted rounded-xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold mb-6 text-center">{servicesTitle}</h3>
              <StaggerContainer delay={0.6}>{serviceList}</StaggerContainer>
              <FadeIn delay={1.0}>{button}</FadeIn>
            </div>
          </ScaleIn>
        </div>
      </div>
    </section>
  )
}
