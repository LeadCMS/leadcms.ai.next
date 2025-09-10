import React from "react"
import { AnimatedCard, AnimatedCardHeader, AnimatedCardContent } from "@/components/ui/animated-card"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { Database, Globe, Zap, CheckCircle } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated-elements"

export interface FeaturesSectionProps {
  title: string
  description: string
  features: {
    icon: "Database" | "Globe" | "Zap"
    title: string
    description: string
    bullets: string[]
  }[]
}

const iconMap = {
  Database: Database,
  Globe: Globe,
  Zap: Zap,
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title,
  description,
  features,
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32" id="features">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1750px] mx-auto">
        <div className="text-center mb-16">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.2}>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </FadeIn>
        </div>
        <StaggerContainer className="grid gap-8 md:grid-cols-3" staggerDelay={0.1}>
        {features.map((feature, idx) => {
          const Icon = iconMap[feature.icon]
          return (
            <StaggerItem key={feature.title + idx}>
              <AnimatedCard
                hoverEffect="lift"
                className="relative overflow-hidden border-2 border-primary/20 group"
              >
                <div className="absolute top-0 right-0 p-2 bg-primary/10 rounded-bl-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <AnimatedCardHeader className="pt-12">
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </AnimatedCardHeader>
                <AnimatedCardContent>
                  <ul className="space-y-3 text-sm">
                    {feature.bullets.map((b, i) => (
                      <li className="flex items-center group/item" key={i}>
                        <CheckCircle className="mr-3 h-4 w-4 text-primary group-hover/item:scale-110 transition-transform duration-200" />
                        <span className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-200">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                </AnimatedCardContent>
              </AnimatedCard>
            </StaggerItem>
          )
        })}
      </StaggerContainer>
      </div>
    </div>
  </section>
)
