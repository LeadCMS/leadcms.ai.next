import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc"
import type { CMSContentTemplateProps } from "@leadcms/sdk"
import { useMDXComponents } from "@/components/mdx-components"
import { DocTableOfContents } from "@/components/doc-table-of-contents"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"

export default function BlogTemplate({
  content,
  userUid,
}: CMSContentTemplateProps & { userUid?: string | null }) {
  const options: MDXRemoteOptions = {
    parseFrontmatter: true,
    scope: {
      // Add any additional scope variables here
    },
  }

  // Blog pages need components that include all MDX and blog-specific components
  const components = useMDXComponents({ userUid })

  // Extract metadata
  const author = content.author
  const publishedAt = content.publishedAt || content.createdAt
  const category = content.category
  const tags = content.tags as string[] | undefined
  const excerpt = content.excerpt as string | undefined
  const coverImageUrl = content.coverImageUrl as string | undefined
  const coverImageAlt = content.coverImageAlt as string | undefined

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = content.body.split(/\s+/).length
  const readTime = Math.ceil(wordCount / 200)

  // Format the published date
  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <main className="flex-1">
      <div className="w-full">
        {/* Article Hero - Side-by-side layout */}
        <section className="w-full border-b bg-muted/30">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-center">
                {/* Left side - Cover Image */}
                <div className="order-1">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl shadow-lg bg-muted">
                    {coverImageUrl ? (
                      <img
                        src={coverImageUrl}
                        alt={coverImageAlt || content.title || "Article cover"}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      // Fallback gradient when no cover image
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary/30 text-center px-6">
                          {category || content.title?.charAt(0) || "B"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Article metadata and title */}
                <div className="order-2 flex flex-col justify-center">
                  {/* Tags/Category badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags &&
                      tags.length > 0 &&
                      tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs font-medium uppercase tracking-wide"
                        >
                          {tag}
                        </Badge>
                      ))}
                    {!tags?.length && category && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium uppercase tracking-wide"
                      >
                        {category}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-balance leading-tight">
                    {content.title}
                  </h1>

                  {/* Excerpt/Description */}
                  {(excerpt || content.description) && (
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                      {excerpt || content.description}
                    </p>
                  )}

                  {/* Author and metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {author && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{author}</span>
                      </div>
                    )}
                    {formattedDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content with Table of Contents */}
        <section className="w-full py-10 md:py-14 lg:py-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-12">
                {/* Main Article Content - Balanced width for readability */}
                <div className="min-w-0 max-w-3xl">
                  <article
                    className="
                    prose prose-lg dark:prose-invert
                    prose-headings:scroll-mt-20
                    prose-headings:font-semibold
                    prose-headings:tracking-tight
                    prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                    prose-p:leading-relaxed prose-p:text-foreground/90
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-lg prose-img:shadow-md
                    prose-img:mx-auto prose-img:w-auto prose-img:max-w-full
                    prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
                    prose-code:text-sm prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-muted prose-pre:border
                  "
                  >
                    <MDXRemote source={content.body} options={options} components={components} />
                  </article>

                  {/* Article footer - Tags and sharing */}
                  <div className="mt-12 pt-8 border-t">
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-muted-foreground mr-2">Tags:</span>
                        {tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Sidebar - Table of Contents (sticky, aligned right) */}
                <aside className="hidden xl:block w-[320px]">
                  <div className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto">
                    <DocTableOfContents content={content.body} />
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
