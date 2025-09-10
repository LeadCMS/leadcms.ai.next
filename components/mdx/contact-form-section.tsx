import type React from "react"
import { CheckCircle } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animated-elements"

export interface ContactFormSectionProps {
  title: string
  description: string
  servicesTitle: string
  services: string[]
  formComponent?: React.ReactNode
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  title,
  description,
  servicesTitle,
  services = [], // Added default empty array for services prop
  formComponent,
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32" id="contact-form">
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1750px] mx-auto">
        <div className="grid gap-12 md:grid-cols-2">
          <FadeIn direction="left">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{description}</p>
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">{servicesTitle}</h3>
                <StaggerContainer delay={0.3}>
                  <ul className="space-y-3">
                    {services.map((service, i) => (
                      <StaggerItem key={i}>
                        <li className="flex items-center group">
                          <CheckCircle className="mr-3 h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                          <span>{service}</span>
                        </li>
                      </StaggerItem>
                    ))}
                  </ul>
                </StaggerContainer>
              </div>
            </div>
          </FadeIn>
          <ScaleIn direction="right" delay={0.4}>
            <div>
              {formComponent || (
                <div className="bg-muted rounded-xl p-8 shadow-sm border text-center">
                  [Contact Form Placeholder]
                </div>
              )}
            </div>
          </ScaleIn>
        </div>
      </div>
    </div>
  </section>
)
