import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated-elements"
import { DynamicIcon } from "@/lib/dynamic-icon"
import { getTextContent } from "@/lib/mdx-utils"

export interface CTASectionProps {
  title: string
  description: string
  children: React.ReactNode
}

export interface CTAButtonProps {
  href: string
  icon?: string
  children: React.ReactNode
}

export const CTAButton: React.FC<CTAButtonProps> = ({ href, icon, children }) => {
  const label = getTextContent(children)

  return (
    <Button asChild size="lg" variant="secondary" className="transition-transform duration-200 hover:scale-105">
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {icon && <DynamicIcon name={icon} className="mr-2 h-4 w-4" />}
        {label}
      </Link>
    </Button>
  )
}

export const CTASection: React.FC<CTASectionProps> = ({ title, description, children }) => {
  const buttons = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === CTAButton
  )

  return (
    <section
      className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
      id="cta"
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-[1750px] mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
            <p className="mt-6 text-xl max-w-2xl mx-auto">{description}</p>
          </FadeIn>
          <StaggerContainer delay={0.4}>
            <div className="flex flex-wrap gap-4 justify-center mt-10">
              {buttons.map((btn, i) => (
                <StaggerItem key={i}>{btn}</StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}
