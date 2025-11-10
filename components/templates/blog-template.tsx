import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc"
import type { CMSContentTemplateProps } from "@leadcms/sdk"
import { useMDXComponents } from "@/components/mdx-components"
import { DocTableOfContents } from "@/components/doc-table-of-contents"
import { BlogCoverGenerator } from "@/components/blog/blog-cover-generator"

export default function BlogTemplate({ content, userUid }: CMSContentTemplateProps & { userUid?: string | null }) {
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

  return (
    <main className="flex-1">
      <div className="w-full">
        {/* Article Cover with All Metadata */}
        <section className="w-full py-8 md:py-12">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1750px] mx-auto">
              <div className="relative w-full overflow-hidden rounded-lg">
                <BlogCoverGenerator
                  title={content.title || 'Blog Post'}
                  category={category}
                  tags={tags}
                  author={author}
                  coverImageUrl={coverImageUrl}
                  featured={false}
                  size="hero"
                  publishedAt={publishedAt}
                  readTime={readTime}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Content with Table of Contents */}
        <section className="w-full py-12">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1750px] mx-auto">
            <div className="flex gap-8">
              {/* Main Article Content */}
              <div className="flex-1 min-w-0">
                <article className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                  <MDXRemote source={content.body} options={options} components={components} />
                </article>
              </div>

              {/* Right Sidebar - Table of Contents */}
              <aside className="hidden xl:block w-64 flex-shrink-0">
                <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
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
