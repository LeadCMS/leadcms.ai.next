import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GitBranch } from "lucide-react"

export interface ContactSectionProps {
  title: string
  description: string
  buttons: { label: string; href: string; icon?: "GitBranch" }[]
}

const iconMap = {
  GitBranch: <GitBranch className="mr-2 h-4 w-4" />,
}

export const ContactSection: React.FC<ContactSectionProps> = ({ title, description, buttons }) => (
  <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground" id="contact">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
      <p className="mt-6 text-xl max-w-2xl mx-auto">{description}</p>
      <div className="flex flex-wrap gap-4 justify-center mt-10">
        {buttons.map((btn, i) => (
          <Button asChild size="lg" variant="secondary" key={i}>
            <Link
              href={btn.href}
              target={btn.href.startsWith("http") ? "_blank" : undefined}
              rel={btn.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {btn.icon ? iconMap[btn.icon] : null}
              {btn.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  </section>
)
