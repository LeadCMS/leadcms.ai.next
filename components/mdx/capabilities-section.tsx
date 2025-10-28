import React from "react"
import { FadeIn, StaggerContainer, StaggerItem, HoverLift } from "@/components/ui/animated-elements"
import { DynamicIcon } from "@/lib/dynamic-icon"
import { getTextContent } from "@/lib/mdx-utils"
import { cn } from "@/lib/utils"

export interface CapabilitiesSectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  variant?: "muted" | "surface" | "soft"
}

export interface CapabilityCardProps {
  icon?: string
  title: string
  children: React.ReactNode
}

export const CapabilitiesSectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const textContent = getTextContent(children)
  return <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{textContent}</h2>
}

export const CapabilitiesSectionDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const textContent = getTextContent(children)
  return <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{textContent}</p>
}

export const CapabilityCard: React.FC<CapabilityCardProps> = ({ icon, title, children }) => {
  const titleText = getTextContent(title)
  const descriptionText = getTextContent(children)

  return (
    <StaggerItem>
      <HoverLift className="h-full">
        <div className="bg-background rounded-xl p-6 shadow-sm border flex flex-col items-center text-center h-full hover:shadow-lg transition-shadow duration-300">
          {icon && (
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
              <DynamicIcon name={icon} className="h-6 w-6 text-primary" />
            </div>
          )}
          <h3 className="text-xl font-bold mb-2">{titleText}</h3>
          <p className="text-muted-foreground flex-1">{descriptionText}</p>
        </div>
      </HoverLift>
    </StaggerItem>
  )
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ title, description, children, variant = "muted" }) => {
  const titleText = typeof title === 'string' ? title : title ? getTextContent(title) : null
  const descriptionText = typeof description === 'string' ? description : description ? getTextContent(description) : null

  const childArray = React.Children.toArray(children)
  const capabilities = childArray.filter(child =>
    React.isValidElement(child) && child.type === CapabilityCard
  )

  const backgroundClasses: Record<NonNullable<CapabilitiesSectionProps["variant"]>, string> = {
    muted: "bg-muted",
    surface: "bg-background",
    soft: "bg-gradient-to-br from-primary/5 via-background to-background dark:from-slate-950 dark:via-primary/20 dark:to-slate-900",
  }

  return (
    <section className={cn("w-full py-12 md:py-24 lg:py-32", backgroundClasses[variant])} id="capabilities">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            {titleText && (
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {titleText}
              </h2>
            )}
            {descriptionText && (
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {descriptionText}
              </p>
            )}
          </div>
        </FadeIn>
        <StaggerContainer>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-[1750px] mx-auto">
            {capabilities}
          </div>
        </StaggerContainer>
      </div>
    </section>
  )
}
