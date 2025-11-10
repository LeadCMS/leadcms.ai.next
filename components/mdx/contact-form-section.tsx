import React from "react"
import { CheckCircle } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/animated-elements"
import { getTextContent } from "@/lib/mdx-utils"

export interface ContactFormSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

export interface ContactFormServiceListProps {
  title?: string
  children: React.ReactNode
}

export interface ContactFormProps {
  children: React.ReactNode
}

export const ContactFormServiceList: React.FC<ContactFormServiceListProps> = ({ title, children }) => {
  // Extract items from the MDX-parsed <ul><li> structure
  const items: string[] = []

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const props = child.props as { children?: React.ReactNode }

      // The child is a ul component (could be a function or 'ul' string)
      // Check if it has children that look like list items
      if (props.children) {
        React.Children.forEach(props.children, (liChild) => {
          if (React.isValidElement(liChild)) {
            const liProps = liChild.props as { children?: React.ReactNode }
            // Check if this looks like an <li> element (has children content)
            if (liProps.children) {
              const text = getTextContent(liProps.children)
              if (text && text.trim()) {
                items.push(text.trim())
              }
            }
          }
        })
      }
    }
  })

  return (
    <>
      {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
      <StaggerContainer delay={0.3}>
        <ul className="space-y-3">
          {items.map((service, i) => (
            <StaggerItem key={i}>
              <li className="flex items-center group">
                <CheckCircle className="mr-3 h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                <span>{service}</span>
              </li>
            </StaggerItem>
          ))}
        </ul>
      </StaggerContainer>
    </>
  )
}

export const ContactForm: React.FC<ContactFormProps> = ({ children }) => {
  return <div>{children}</div>
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  title,
  description,
  children,
}) => {
  const childrenArray = React.Children.toArray(children)
  const serviceList = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === ContactFormServiceList
  )
  const formComponent = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === ContactForm
  )

  return (
    <section className="w-full py-12 md:py-24 lg:py-32" id="contact-form">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1750px] mx-auto">
          <div className="grid gap-12 md:grid-cols-2">
            <FadeIn direction="left">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>
                <p className="mt-4 text-lg text-muted-foreground">{description}</p>
                <div className="mt-8">
                  {serviceList}
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
}
