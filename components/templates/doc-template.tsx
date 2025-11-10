import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc"
import type { CMSContentTemplateProps } from "@leadcms/sdk"
import { useMDXComponents } from "@/components/mdx-components"
import { DocNavigation, getDocsData } from "@/components/doc-navigation"
import { DocTableOfContents } from "@/components/doc-table-of-contents"
// import { Badge } from "@/components/ui/badge"
// import { Clock, Calendar } from "lucide-react"
import { DocMobileNavProvider } from "@/components/doc-mobile-nav-provider"
import { LocaleAwareLink } from "@/components/locale-aware-link"

export default function DocTemplate({ content, userUid }: CMSContentTemplateProps & { userUid?: string | null }) {
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

  // Doc pages need components that include all MDX and doc-specific components
  const components = useMDXComponents({ userUid })

  // Get metadata from frontmatter
  const group = content.group || "Documentation"
  const order = content.order || 0

  // Get docs data for mobile navigation
  const docGroups = getDocsData()

  return (
    <DocMobileNavProvider currentSlug={content.slug} docGroups={docGroups}>
      <div className="w-full">
        <div className="flex min-h-screen bg-background max-w-[1750px] mx-auto">
          {/* Left Sidebar - Documentation Navigation */}
          <aside className="hidden lg:block w-64 border-r border-border bg-muted/30">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
              <DocNavigation currentSlug={content.slug} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
              {/* Breadcrumbs and Meta */}
              <div className="mb-8">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
                  <LocaleAwareLink
                    href="/docs"
                    className="hover:text-foreground transition-colors hover:underline underline-offset-4"
                  >
                    Documentation
                  </LocaleAwareLink>
                  <span className="text-muted-foreground/50" aria-hidden="true">/</span>
                  <span className="text-foreground/70 bg-muted/50 px-2 py-1 rounded-md text-xs font-medium">
                    {group}
                  </span>
                </nav>

                {/* <h1 className="text-4xl font-bold tracking-tight mb-4">{content.title}</h1>

                {content.description && (
                  <p className="text-xl text-muted-foreground mb-6">{content.description}</p>
                )}

                {lastUpdated && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Last updated: {lastUpdated}</span>
                    </div>
                  </div>
                )} */}
              </div>

              {/* Content */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <MDXRemote source={content.body} options={options} components={components} />
              </div>
            </div>
          </main>

          {/* Right Sidebar - Table of Contents */}
          <aside className="hidden xl:block w-64 border-l border-border bg-muted/30">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
              <DocTableOfContents content={content.body} />
            </div>
          </aside>
        </div>
      </div>
    </DocMobileNavProvider>
  )
}
