import { getAllContentSlugs, getCMSContentBySlug } from "@/lib/cms"
import path from "path"
import { notFound } from "next/navigation"
import { getTemplate } from "@/components/templates"

const CMS_CONTENT_PATH = path.resolve(".leadcms/content")

interface PageProps {
  params: { slug: string[] }
}

export default async function CatchAllPage({ params }: PageProps) {
  const awaitedParams = await params
  const slug = awaitedParams.slug.join("/")
  const content = await getCMSContentBySlug(slug, CMS_CONTENT_PATH)
  if (!content) notFound()
  const TemplateComponent = getTemplate(content.type)
  if (!TemplateComponent) {
    throw new Error(`No template found for content type: ${content.type}`)
  }
  return <TemplateComponent content={content} />
}

// Dynamic metadata for all CMS-driven pages
export async function generateMetadata({ params }: PageProps) {
  const awaitedParams = await params
  const slug = awaitedParams.slug.join("/")
  const content = await getCMSContentBySlug(slug, CMS_CONTENT_PATH)
  if (!content) notFound()
  return {
    title: content.title,
    description: content.description,
  }
}

export async function generateStaticParams() {
  const slugs: string[] = await getAllContentSlugs(CMS_CONTENT_PATH, [
    "legal",
    "contact",    
    "not-found",
  ])
  console.log("Generating static params for slugs:", slugs)
  return slugs.map((slug: string) => ({ slug: slug.split("/") }))
}

// For static export, we need to disable dynamic params
export const dynamicParams = false
