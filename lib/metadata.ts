import type { Metadata } from "next"
import type { CMSContent } from "@leadcms/sdk"

/**
 * Generate page metadata for content with userUid support for preview URLs
 */
export function generatePageMetadata(
  content: CMSContent,
  slug: string,
  userUid?: string | null
): Metadata {
  const baseMetadata: Metadata = {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
    },
  }

  // Add cover image if available
  if (content.coverImageUrl) {
    baseMetadata.openGraph = {
      ...baseMetadata.openGraph,
      images: [
        {
          url: content.coverImageUrl,
          alt: content.coverImageAlt || content.title,
        },
      ],
    }
    baseMetadata.twitter = {
      ...baseMetadata.twitter,
      images: [content.coverImageUrl],
    }
  }

  // Add noindex for preview content with userUid
  if (userUid) {
    baseMetadata.robots = {
      index: false,
      follow: false,
    }
  }

  return baseMetadata
}
