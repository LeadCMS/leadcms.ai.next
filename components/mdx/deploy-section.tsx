import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, TypeWriter } from "@/components/ui/animated-elements"
import { cn } from "@/lib/utils"
import { getTextContent } from "@/lib/mdx-utils"

export interface DeploySectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  variant?: "surface" | "muted" | "gradient"
}

export interface DeployCommandsProps {
  children: React.ReactNode
}

export interface DeployCardsProps {
  children: React.ReactNode
}

export interface DeployButtonProps {
  href: string
  children: React.ReactNode
}

export const DeployCommands: React.FC<DeployCommandsProps> = ({ children }) => {
  const textContent = getTextContent(children)
  const commands = textContent.split('\n').filter(cmd => cmd.trim())

  return (
    <ScaleIn delay={0.2}>
      <div className="bg-black rounded-lg overflow-hidden shadow-xl relative">
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/10 rounded-full z-[-1]"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/10 rounded-full z-[-1]"></div>
        <div className="flex items-center h-8 bg-gray-800 px-4">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-2 text-xs text-gray-400">terminal</div>
        </div>
        <div className="p-4 md:p-8 overflow-x-auto">
          <TypeWriter
            text={commands.join('\n$ ')}
            className="text-green-400 font-mono text-sm md:text-base whitespace-pre-wrap break-all"
            speed={150}
            startDelay={200}
          />
        </div>
      </div>
    </ScaleIn>
  )
}

export const DeployCards: React.FC<DeployCardsProps> = ({ children }) => {
  return (
    <StaggerContainer delay={0.6}>
      <div className="grid gap-8 md:grid-cols-2 mt-12">
        {children}
      </div>
    </StaggerContainer>
  )
}

export const DeployButton: React.FC<DeployButtonProps> = ({ href, children }) => {
  const textContent = getTextContent(children)

  return (
    <FadeIn delay={1.0}>
      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href={href} target={href.startsWith('http') ? "_blank" : undefined} rel={href.startsWith('http') ? "noopener noreferrer" : undefined}>
            {textContent}
          </Link>
        </Button>
      </div>
    </FadeIn>
  )
}

export const DeploySection: React.FC<DeploySectionProps> = ({
  title,
  description,
  children,
  variant = "gradient",
}) => {
  const titleText = typeof title === 'string' ? title : title ? getTextContent(title) : null
  const descriptionText = typeof description === 'string' ? description : description ? getTextContent(description) : null

  const backgroundClasses: Record<NonNullable<DeploySectionProps["variant"]>, string> = {
    surface: "bg-background",
    muted: "bg-muted dark:bg-slate-900",
    gradient: "bg-gradient-to-br from-background via-primary/10 to-primary/20 dark:from-slate-950 dark:via-primary/20 dark:to-slate-900",
  }

  return (
    <section className={cn("relative w-full py-12 md:py-24 lg:py-32 overflow-hidden", backgroundClasses[variant])}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {(titleText || descriptionText) && (
          <FadeIn>
            <div className="text-center mb-16">
              {titleText && (
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{titleText}</h2>
              )}
              {descriptionText && (
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{descriptionText}</p>
              )}
            </div>
          </FadeIn>
        )}
        <div className="max-w-[1750px] mx-auto">
          {children}
        </div>
      </div>
    </section>
  )
}
