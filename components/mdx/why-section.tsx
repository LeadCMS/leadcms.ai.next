import React from "react"
import { FadeIn, StaggerContainer, StaggerItem, HoverLift } from "@/components/ui/animated-elements"
import { DynamicIcon } from "@/lib/dynamic-icon"

export interface WhySectionProps {
  title: string
  description: string
  reasons: {
    icon: string
    title: string
    description: string
  }[]
}

export const WhySection: React.FC<WhySectionProps> = ({ title, description, reasons }) => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="why">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </div>
      </FadeIn>
      <StaggerContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-[1750px] mx-auto">
          {reasons.map((reason, idx) => (
            <StaggerItem key={reason.title + idx}>
              <HoverLift className="h-full">
                <div className="bg-background rounded-xl p-6 shadow-sm border flex flex-col items-center text-center h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                    <DynamicIcon name={reason.icon} className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                  <p className="text-muted-foreground flex-1">{reason.description}</p>
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
    </div>
  </section>
)
