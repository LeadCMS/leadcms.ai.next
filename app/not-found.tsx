import { getCMSContentBySlug } from "@/lib/cms"
import path from "path"
import { getTemplate } from "@/components/templates"
import metadata from "@/.leadcms/content/metadata.json"

const CMS_CONTENT_PATH = path.resolve(".leadcms/content")

export default function NotFound() {
  const content = getCMSContentBySlug("not-found", CMS_CONTENT_PATH)
  if (!content) {
    // Fallback if not-found.mdx doesn't exist
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600">Sorry, the page you are looking for does not exist.</p>
      </div>
    )
  }

  const TemplateComponent = getTemplate(content.type)
  if (!TemplateComponent) {
    throw new Error(`No template found for content type: ${content.type}`)
  }
  return <TemplateComponent content={content} />
}
