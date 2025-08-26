import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc"
import type { CMSContentTemplateProps } from "@/lib/cms"
import mdxComponents from "@/components/mdx";

export default function DefaultTemplate({ content }: CMSContentTemplateProps) {
  const options: MDXRemoteOptions = {
    parseFrontmatter: true,
    scope: {
      // Add any additional scope variables here
    },
  }

  // Format lastUpdated from content.updatedAt or content.createdAt
  const lastUpdatedRaw = content.updatedAt || content.createdAt
  const lastUpdated = lastUpdatedRaw ? new Date(lastUpdatedRaw).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : undefined

  // Legal pages might use different components than about pages
  const components = {
    ...mdxComponents
  }

  // For static builds, let errors bubble up to fail the build
  // No need for Suspense or error handling since everything is resolved at build time
  return (
    <main className="flex-1">
      <MDXRemote source={content.body} options={options} components={components} />
    </main>
  )
}