import type React from "react"
import { Settings, Code, ShieldCheck, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface HelpSectionProps {
  title: string
  description: string
  services: {
    icon: "Settings" | "Code" | "ShieldCheck"
    title: string
    description: string
  }[]
  serviceList: string[]
  servicesTitle: string
  contactButton: { label: string; href: string }
}

const iconMap = {
  Settings,
  Code,
  ShieldCheck,
}

export const HelpSection: React.FC<HelpSectionProps> = ({
  title,
  description,
  services = [], // Added default empty array to prevent map error
  serviceList = [], // Added default empty array to prevent map error
  servicesTitle,
  contactButton = { label: "Contact Us", href: "#" }, // Added default contactButton to prevent href error
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32" id="help">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-2 items-center max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          <div className="mt-8 space-y-6">
            {services.map((service, idx) => {
              const Icon = iconMap[service.icon]
              return (
                <div className="flex items-start gap-4" key={service.title + idx}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="bg-muted rounded-xl p-8 shadow-sm border">
          <h3 className="text-2xl font-bold mb-6 text-center">{servicesTitle}</h3>
          <ul className="space-y-4">
            {serviceList.map((item, i) => (
              <li className="flex items-center" key={i}>
                <CheckCircle className="mr-3 h-5 w-5 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="w-full mt-8">
            <Link
              href={contactButton.href}
              target={contactButton.href.startsWith("http") ? "_blank" : undefined}
              rel={contactButton.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {contactButton.label}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
)
