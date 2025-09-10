import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GitBranch } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/animated-elements"

export interface ContactSectionProps {
  title: string
  description: string
  buttons: { label: string; href: string; icon?: "GitBranch" }[]
}

const iconMap = {
  GitBranch: <GitBranch className="mr-2 h-4 w-4" />,
}

export const ContactSection: React.FC<ContactSectionProps> = ({ title, description, buttons }) => (
  <section
    className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground"
    id="contact"
  >
    <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-[1750px] mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
          <p className="mt-6 text-xl max-w-2xl mx-auto">{description}</p>
        </FadeIn>
      <StaggerContainer delay={0.4}>
        <div className="flex flex-wrap gap-4 justify-center mt-10">
          {buttons.map((btn, i) => (
            <StaggerItem key={i}>
              <Button asChild size="lg" variant="secondary" className="transition-transform duration-200 hover:scale-105">
                <Link
                  href={btn.href}
                  target={btn.href.startsWith("http") ? "_blank" : undefined}
                  rel={btn.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {btn.icon ? iconMap[btn.icon] : null}
                  {btn.label}
                </Link>
              </Button>
            </StaggerItem>
          ))}
        </div>
      </StaggerContainer>
      </div>
    </div>
  </section>
)
