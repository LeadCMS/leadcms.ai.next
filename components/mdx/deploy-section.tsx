import type React from "react"
import { Server, Code, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface DeploySectionProps {
  title: string
  description: string
  commands: string[]
  specs: string[]
  devExperience: string[]
  docButton: { label: string; href: string }
}

export const DeploySection: React.FC<DeploySectionProps> = ({
  title,
  description,
  commands = [], // Added default empty array to prevent map error
  specs = [], // Added default empty array to prevent map error
  devExperience = [], // Added default empty array to prevent map error
  docButton = { label: "Documentation", href: "#" }, // Added default docButton to prevent href error
}) => (
  <section className="w-full py-12 md:py-24 lg:py-32">
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-black rounded-lg overflow-hidden shadow-xl relative">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/10 rounded-full z-[-1]"></div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/10 rounded-full z-[-1]"></div>
          <div className="flex items-center h-8 bg-gray-800 px-4">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="ml-2 text-xs text-gray-400">terminal</div>
          </div>
          <div className="p-4 md:p-8 overflow-x-auto">
            <pre className="text-green-400 font-mono text-sm md:text-base whitespace-pre-wrap break-all">
              {commands.map((cmd, i) => (
                <div key={i}>
                  <span className="text-blue-400">$</span> {cmd}
                </div>
              ))}
            </pre>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 mt-12">
          <div className="bg-background rounded-xl p-8 shadow-sm border text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Technical Specifications</h3>
            <ul className="space-y-3 text-left">
              {specs.map((spec, i) => (
                <li className="flex items-start" key={i}>
                  <CheckCircle className="mr-2 h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-background rounded-xl p-8 shadow-sm border text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Developer Experience</h3>
            <ul className="space-y-3 text-left">
              {devExperience.map((exp, i) => (
                <li className="flex items-start" key={i}>
                  <CheckCircle className="mr-2 h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href={docButton.href} target="_blank" rel="noopener noreferrer">
              {docButton.label}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
)
