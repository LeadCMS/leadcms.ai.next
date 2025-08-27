import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, Phone, MapPin } from "lucide-react"
import * as LucideIcons from "lucide-react"

interface LegalSectionProps {
  title: string
  children: React.ReactNode
}

export const LegalSection: React.FC<LegalSectionProps> = ({ title, children }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

interface LegalListProps {
  items: string[]
  showChecks?: boolean
}

export const LegalList: React.FC<LegalListProps> = ({ items, showChecks = true }) => (
  <ul className="space-y-3 text-muted-foreground">
    {items.map((item, index) => (
      <li key={index} className="flex items-start">
        {showChecks && <CheckCircle className="mr-3 h-5 w-5 text-primary mt-1 flex-shrink-0" />}
        <span dangerouslySetInnerHTML={{ __html: item }} />
      </li>
    ))}
  </ul>
)

interface ContactInfoProps {
  type: "email" | "phone" | "address"
  value: string
  label?: string
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ type, value, label }) => {
  const iconMap = {
    email: Mail,
    phone: Phone,
    address: MapPin,
  }

  const Icon = iconMap[type]

  return (
    <div className="bg-background rounded-xl p-6 shadow-sm border">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold">
            {label || type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <p className="text-muted-foreground">{value}</p>
        </div>
      </div>
    </div>
  )
}

interface DisclaimerBoxProps {
  children: React.ReactNode
}

export const DisclaimerBox: React.FC<DisclaimerBoxProps> = ({ children }) => (
  <div className="bg-muted rounded-xl p-6">
    <p className="text-muted-foreground font-medium">{children}</p>
  </div>
)

interface PrivacyGridProps {
  items: Array<{
    icon: keyof typeof LucideIcons
    title: string
    description: string
    bullets: string[]
  }>
}

export const PrivacyGrid: React.FC<PrivacyGridProps> = ({ items }) => (
  <div className="grid gap-6 mt-4 md:grid-cols-2">
    {items.map((item, index) => {
      const Icon = LucideIcons[item.icon] as React.ComponentType<any>
      return (
        <div key={index} className="bg-background rounded-xl p-6 shadow-sm border">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-2">{item.title}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {item.bullets.map((bullet, bulletIndex) => (
              <li key={bulletIndex}>{bullet}</li>
            ))}
          </ul>
        </div>
      )
    })}
  </div>
)

interface SecurityPracticesProps {
  title?: string
  practices: string[]
}

export const SecurityPractices: React.FC<SecurityPracticesProps> = ({
  title = "Our Security Practices Include:",
  practices,
}) => (
  <div className="bg-muted rounded-xl p-6 mt-4">
    <h3 className="text-lg font-bold mb-4">{title}</h3>
    <ul className="space-y-3">
      {practices.map((practice, index) => (
        <li key={index} className="flex items-start">
          <CheckCircle className="mr-3 h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <span>{practice}</span>
        </li>
      ))}
    </ul>
  </div>
)

interface RightsGridProps {
  rights: Array<{
    title: string
    description: string
  }>
}

export const RightsGrid: React.FC<RightsGridProps> = ({ rights }) => (
  <div className="grid gap-4 mt-6 sm:grid-cols-2">
    {rights.map((right, index) => (
      <div key={index} className="bg-background rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-bold mb-3">{right.title}</h3>
        <p className="text-muted-foreground">{right.description}</p>
      </div>
    ))}
  </div>
)
