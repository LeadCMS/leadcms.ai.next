import type { CMSContent } from "@/lib/cms"
import LegalTemplate from "./legal-template"
import ContactTemplate from "./contact-template"
import DefaultTemplate from "./default-template"

export interface TemplateProps {
  content: CMSContent
}

export type TemplateComponent = React.ComponentType<TemplateProps>

export const templateRegistry: Record<string, TemplateComponent> = {
  legal: LegalTemplate,
  contact: ContactTemplate,
}

export function getTemplate(type: string): TemplateComponent | null {
  return templateRegistry[type] || DefaultTemplate
}
