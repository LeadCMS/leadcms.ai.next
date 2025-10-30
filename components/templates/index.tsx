import type { CMSContent } from "@leadcms/sdk"
import LegalTemplate from "./legal-template"
import ContactTemplate from "./contact-template"
import DocTemplate from "./doc-template"
import BlogTemplate from "./blog-template"
import BlogIndexTemplate from "./blog-index-template"
import DefaultTemplate from "./default-template"

export interface TemplateProps {
  content: CMSContent
}

export type TemplateComponent = React.ComponentType<TemplateProps>

export const templateRegistry: Record<string, TemplateComponent> = {
  legal: LegalTemplate,
  contact: ContactTemplate,
  doc: DocTemplate,
  "blog-article": BlogTemplate,
  "blog-index": BlogIndexTemplate,
}

export function getTemplate(type: string): TemplateComponent | null {
  return templateRegistry[type] || DefaultTemplate
}
