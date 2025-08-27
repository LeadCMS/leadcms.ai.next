import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { Badge } from "@/components/ui/badge"
import * as LucideIcons from "lucide-react"
import { ContactUs } from "@/components/contact-us"

interface ContactOption {
  icon: keyof typeof LucideIcons
  title: string
  description: string
  links: Array<{
    icon: keyof typeof LucideIcons
    label: string
    href?: string
    text?: string
  }>
}

interface ContactHeroWithOptionsProps {
  badge?: string
  title: string
  description: string
  options: ContactOption[]
}

export const ContactHeroWithOptions: React.FC<ContactHeroWithOptionsProps> = ({
  badge = "Support",
  title,
  description,
  options,
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <Badge className="mb-4" variant="outline">
          {badge}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
        {options.map((option, index) => {
          const Icon = LucideIcons[option.icon] as React.ComponentType<any>
          return (
            <Card key={index} className="relative overflow-hidden border-2 border-primary/20">
              <div className="absolute top-0 right-0 p-2 bg-primary/10 rounded-bl-lg">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <CardHeader className="pt-12">
                <CardTitle>{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {option.links.map((link, linkIndex) => {
                    const LinkIcon = LucideIcons[link.icon] as React.ComponentType<any>
                    return (
                      <li key={linkIndex} className="flex items-center">
                        <LinkIcon className="mr-2 h-4 w-4 text-primary" />
                        {link.href ? (
                          <Link
                            href={link.href}
                            className="hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <span>{link.text || link.label}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  </section>
)

interface ContactHeroProps {
  badge?: string
  title: string
  description: string
}

export const ContactHero: React.FC<ContactHeroProps> = ({
  badge = "Support",
  title,
  description,
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <Badge className="mb-4" variant="outline">
          {badge}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>
    </div>
  </section>
)

interface ContactFormSectionProps {
  title: string
  description: string
  features: Array<{
    icon: keyof typeof LucideIcons
    title: string
    description: string
  }>
  partnershipSection?: {
    title: string
    description: string
    email: string
  }
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  title,
  description,
  features,
  partnershipSection,
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32" id="contact-form">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>

            <div className="mt-8 space-y-6">
              {features.map((feature, index) => {
                const Icon = LucideIcons[feature.icon] as React.ComponentType<any>
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {partnershipSection && (
              <div className="mt-10" id="partnership">
                <h3 className="text-xl font-bold mb-4">{partnershipSection.title}</h3>
                <p className="text-muted-foreground mb-4">{partnershipSection.description}</p>
                <div className="flex items-center">
                  <LucideIcons.Mail className="mr-2 h-5 w-5 text-primary" />
                  <span>
                    Email us at <strong>{partnershipSection.email}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
          <ContactUs />
        </div>
      </div>
    </div>
  </section>
)

interface OfficeLocationProps {
  title?: string
  address: {
    company: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  businessHours: Array<{
    days: string
    hours: string
  }>
}

export const OfficeLocation: React.FC<OfficeLocationProps> = ({
  title = "Office Location",
  address,
  businessHours,
}) => (
  <div>
    <h2 className="text-3xl font-bold tracking-tighter mb-8">{title}</h2>
    <div className="bg-background rounded-xl p-8 shadow-sm border">
      <div className="flex items-start mb-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mr-4">
          <LucideIcons.MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{address.company}</h3>
          <address className="not-italic text-muted-foreground">
            {address.street}
            <br />
            {address.city} {address.state}
            {address.zip && ` ${address.zip}`}
            <br />
            {address.country}
          </address>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-3">Business Hours</h4>
        <ul className="space-y-2 text-muted-foreground">
          {businessHours.map((schedule, index) => (
            <li key={index} className="flex justify-between">
              <span>{schedule.days}</span>
              <span>{schedule.hours}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)

interface SocialLink {
  platform: string
  icon: keyof typeof LucideIcons
  href: string
}

interface SocialLinksProps {
  title?: string
  description?: string
  links: SocialLink[]
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  title = "Connect With Us",
  description = "Follow us on social media to stay updated with the latest news, features, and community events.",
  links,
}) => (
  <div>
    <h2 className="text-3xl font-bold tracking-tighter mb-8">{title}</h2>
    <div className="bg-background rounded-xl p-8 shadow-sm border">
      <p className="text-muted-foreground mb-6">{description}</p>

      <div
        className={`grid gap-4 ${links.length === 1 ? "grid-cols-1 max-w-xs" : links.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}
      >
        {links.map((link, index) => {
          const Icon = LucideIcons[link.icon] as React.ComponentType<any>
          return (
            <Link
              key={index}
              href={link.href}
              className="flex items-center p-4 border rounded-lg transition-colors hover:bg-muted"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">{link.platform}</span>
            </Link>
          )
        })}
      </div>
    </div>
  </div>
)

interface ContactLocationAndSocialProps {
  office: OfficeLocationProps
  social: SocialLinksProps
}

export const ContactLocationAndSocial: React.FC<ContactLocationAndSocialProps> = ({
  office,
  social,
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid gap-12 md:grid-cols-2">
        <OfficeLocation {...office} />
        <SocialLinks {...social} />
      </div>
    </div>
  </section>
)

interface ContactCTAProps {
  title: string
  description: string
  buttons: Array<{
    label: string
    href: string
    icon?: keyof typeof LucideIcons
    variant?: "default" | "secondary"
  }>
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ title, description, buttons }) => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
      <p className="mt-6 text-xl max-w-2xl mx-auto">{description}</p>
      <div className="flex flex-wrap gap-4 justify-center mt-10">
        {buttons.map((button, index) => {
          const Icon = button.icon ? (LucideIcons[button.icon] as React.ComponentType<any>) : null
          return (
            <Button key={index} asChild size="lg" variant={button.variant || "secondary"}>
              <Link href={button.href} target="_blank" rel="noopener noreferrer">
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {button.label}
              </Link>
            </Button>
          )
        })}
      </div>
    </div>
  </section>
)
