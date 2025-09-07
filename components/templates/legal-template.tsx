import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc"
import type { CMSContentTemplateProps } from "@/lib/cms"
import { useMDXComponents } from "@/components/mdx-components"
import { Badge } from "@/components/ui/badge"

export default function LegalTemplate({ content }: CMSContentTemplateProps) {
  const options: MDXRemoteOptions = {
    parseFrontmatter: true,
    scope: {
      // Add any additional scope variables here
    },
  }

  // Format lastUpdated from content.updatedAt or content.createdAt
  const lastUpdatedRaw = content.updatedAt || content.createdAt
  const lastUpdated = lastUpdatedRaw
    ? new Date(lastUpdatedRaw).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined

  // Legal pages need components that include legal components
  const components = useMDXComponents({})

  // For static builds, let errors bubble up to fail the build
  // No need for Suspense or error handling since everything is resolved at build time
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              Legal
            </Badge>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{content.title}</h1>
            {lastUpdated && (
              <p className="mt-4 text-lg text-muted-foreground">Last Updated: {lastUpdated}</p>
            )}
          </div>
          <div className="prose prose-gray dark:prose-invert max-w-none mx-auto">
            <MDXRemote source={content.body} options={options} components={components} />
          </div>
        </div>
      </section>
    </main>
  )
}
