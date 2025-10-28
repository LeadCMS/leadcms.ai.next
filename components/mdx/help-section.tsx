import type React from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animated-elements"
import { DynamicIcon } from "@/lib/dynamic-icon"
import { cn } from "@/lib/utils"

export interface HelpSectionProps {
  title: string
  description: string
  services: {
    icon: string
    title: string
    description: string
  }[]
  serviceList: string[]
  servicesTitle: string
  contactButton: { label: string; href: string }
  variant?: "surface" | "muted" | "soft"
}

export const HelpSection: React.FC<HelpSectionProps> = ({
  title,
  description,
  services = [], // Added default empty array to prevent map error
  serviceList = [], // Added default empty array to prevent map error
  servicesTitle,
  contactButton = { label: "Contact Us", href: "#" }, // Added default contactButton to prevent href error
  variant = "surface",
}) => {
  const backgroundClasses: Record<NonNullable<HelpSectionProps["variant"]>, string> = {
    surface: "bg-background",
    muted: "bg-muted dark:bg-slate-900",
    soft: "bg-primary/5 dark:bg-primary/10",
  }

  return (
    <section className={cn("w-full py-12 md:py-24 lg:py-32", backgroundClasses[variant])} id="help">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-2 items-center max-w-[1750px] mx-auto">
        <FadeIn direction="left">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            <StaggerContainer delay={0.3}>
              <div className="mt-8 space-y-6">
                {services.map((service, idx) => (
                  <StaggerItem key={service.title + idx}>
                    <div className="flex items-start gap-4 group">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <DynamicIcon name={service.icon} className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                        <p className="text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </FadeIn>
        <ScaleIn direction="right" delay={0.4}>
          <div className="bg-muted rounded-xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center">{servicesTitle}</h3>
            <StaggerContainer delay={0.6}>
              <ul className="space-y-4">
                {serviceList.map((item, i) => (
                  <StaggerItem key={i}>
                    <li className="flex items-center group">
                      <CheckCircle className="mr-3 h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                      <span>{item}</span>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
            </StaggerContainer>
            <FadeIn delay={1.0}>
              <Button asChild className="w-full mt-8">
                <Link
                  href={contactButton.href}
                  target={contactButton.href.startsWith("http") ? "_blank" : undefined}
                  rel={contactButton.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {contactButton.label}
                </Link>
              </Button>
            </FadeIn>
          </div>
        </ScaleIn>
      </div>
    </div>
    </section>
  )
}
