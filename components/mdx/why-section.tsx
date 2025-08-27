import React from "react"
import {
  Code,
  Server,
  GitBranch,
  Package,
  Lock,
  Globe,
  Zap,
  Database,
  Settings,
  ShieldCheck,
} from "lucide-react"

export interface WhySectionProps {
  title: string
  description: string
  reasons: {
    icon:
      | "Code"
      | "Server"
      | "GitBranch"
      | "Package"
      | "Lock"
      | "Globe"
      | "Zap"
      | "Database"
      | "Settings"
      | "ShieldCheck"
    title: string
    description: string
  }[]
}

const iconMap = {
  Code,
  Server,
  GitBranch,
  Package,
  Lock,
  Globe,
  Zap,
  Database,
  Settings,
  ShieldCheck,
}

export const WhySection: React.FC<WhySectionProps> = ({ title, description, reasons }) => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="why">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {reasons.map((reason, idx) => {
          const Icon = iconMap[reason.icon] ?? Code // fallback to Code icon
          return (
            <div
              className="bg-background rounded-xl p-6 shadow-sm border flex flex-col items-center text-center"
              key={reason.title + idx}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
              <p className="text-muted-foreground">{reason.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  </section>
)
