import { notFound } from "next/navigation"
import {
  getAllContentSlugsForLocale,
  getCMSContentBySlugForLocale,
  extractUserUidFromSlug,
} from "@leadcms/sdk"
import { getTemplate } from "@/components/templates"
import { LocaleAwareLayout } from "@/components/locale-aware-layout"
import { DEFAULT_LANGUAGE } from "./locale-utils"
import { generatePageMetadata } from "./metadata"
import { PageProps } from "./types"

export const pagesContentTypes = [
  "legal",
  "contact",
  "landing",
  "doc",
  "blog-article",
  "blog-index",
] as const

/**
 * Factory function to create a locale-specific home page component
 */
export function createLocaleHomePage(locale?: string) {
  async function generateHomeMetadata({ params }: { params: PageProps["params"] }) {
    const awaitedParams = params ? await params : { slug: [] }
    const slug = awaitedParams.slug?.join("/") || "home"

    // Extract userUid from slug if it's a preview slug
    const userUid = extractUserUidFromSlug(slug)

    const content = getCMSContentBySlugForLocale("home", locale, userUid as any)
    if (!content) {
      throw new Error(`Home page content not found for locale: ${locale}. Build failed.`)
    }

    return generatePageMetadata(content, "home", userUid)
  }

  async function LocaleHomePage({ params }: PageProps) {
    const awaitedParams = params ? await params : { slug: [] }
    const slug = awaitedParams.slug?.join("/") || "home"

    // Extract userUid from slug if it's a preview slug
    const userUid = extractUserUidFromSlug(slug)

    const content = getCMSContentBySlugForLocale("home", locale, userUid as any)

    if (!content) {
      throw new Error(`Home page content not found for locale: ${locale}. Build failed.`)
    }

    const TemplateComponent = getTemplate(content.type)
    if (!TemplateComponent) {
      throw new Error(`No template found for content type: ${content.type}`)
    }

    return <TemplateComponent content={content} userUid={userUid} />
  }

  return {
    generateMetadata: generateHomeMetadata,
    default: LocaleHomePage,
  }
}

/**
 * Factory function to create a locale-specific dynamic content page component
 */
export function createLocaleContentPage(locale?: string) {
  async function LocaleSlugPage({ params }: PageProps) {
    const awaitedParams = await params
    const slug = awaitedParams.slug?.join("/") || ""

    // Extract userUid from slug if it's a preview slug
    const userUid = extractUserUidFromSlug(slug)

    // Note: Using type assertion until SDK package is updated with new signature
    const content = getCMSContentBySlugForLocale(slug, locale, userUid as any)
    if (!content) notFound()

    const TemplateComponent = getTemplate(content.type)
    if (!TemplateComponent) {
      throw new Error(`No template found for content type: ${content.type}`)
    }
    return <TemplateComponent content={content} userUid={userUid} />
  }

  async function generateMetadata({ params }: PageProps) {
    const awaitedParams = await params
    const slug = awaitedParams.slug?.join("/") || ""

    // Extract userUid from slug if it's a preview slug
    const userUid = extractUserUidFromSlug(slug)

    // Note: Using type assertion until SDK package is updated with new signature
    const content = getCMSContentBySlugForLocale(slug, locale, userUid as any)
    if (!content) notFound()

    return generatePageMetadata(content, slug, userUid)
  }

  async function generateStaticParams() {
    const slugs: string[] = getAllContentSlugsForLocale(locale, [...pagesContentTypes, "not-found"])
    console.log(
      `Generating static params for ${locale === DEFAULT_LANGUAGE ? "default language" : locale} slugs:`,
      slugs
    )
    return slugs.map((slug: string) => ({ slug: slug.split("/") }))
  }

  return {
    default: LocaleSlugPage,
    generateMetadata,
    generateStaticParams,
  }
}

/**
 * Factory function to create a locale-specific not-found page component
 */
export function createLocaleNotFoundPage(locale?: string) {
  function LocaleNotFoundPage({ params }: PageProps) {
    // For not-found pages, we typically don't have preview support, but let's be consistent
    let userUid: string | null = null

    // Load not-found content for the specific locale
    const content = getCMSContentBySlugForLocale("not-found", locale, userUid as any)

    const notFoundContent = () => {
      if (!content) {
        throw new Error(`Not-found page content not found for locale: ${locale}. Build failed.`)
      }

      const TemplateComponent = getTemplate(content.type)
      if (!TemplateComponent) {
        throw new Error(`No template found for content type: ${content.type}`)
      }
      return <TemplateComponent content={content} userUid={userUid} />
    }

    // Only wrap with LocaleAwareLayout for the default language
    // Locale-specific not-found pages already get the layout from their locale layout files
    if (locale === DEFAULT_LANGUAGE) {
      return <LocaleAwareLayout>{notFoundContent()}</LocaleAwareLayout>
    }

    return notFoundContent()
  }

  return {
    default: LocaleNotFoundPage,
  }
}
