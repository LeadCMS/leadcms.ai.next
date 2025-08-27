import { getCMSContentBySlug } from "@/lib/cms"
import path from "path"
import { notFound } from "next/navigation"
import { getTemplate } from "@/components/templates"
import metadata from "@/.leadcms/content/metadata.json"

const CMS_CONTENT_PATH = path.resolve(".leadcms/content")

export default function HomePage() {
  const content = getCMSContentBySlug("home", CMS_CONTENT_PATH)
  if (!content) notFound()
  const TemplateComponent = getTemplate(content.type)
  if (!TemplateComponent) {
    throw new Error(`No template found for content type: ${content.type}`)
  }
  return <TemplateComponent content={content} />
}