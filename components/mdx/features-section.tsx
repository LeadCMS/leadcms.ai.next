import React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Database, Globe, Zap, CheckCircle } from "lucide-react"

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
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature, idx) => {
          const Icon = iconMap[feature.icon]
          return (
            <Card
              className="relative overflow-hidden border-2 border-primary/20"
              key={feature.title + idx}
            >
              <div className="absolute top-0 right-0 p-2 bg-primary/10 rounded-bl-lg">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <CardHeader className="pt-12">
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {feature.bullets.map((b, i) => (
                    <li className="flex items-center" key={i}>
                      <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  </section>
)
