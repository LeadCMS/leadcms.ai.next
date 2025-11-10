import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"
import { LocaleAwareLink } from "@/components/locale-aware-link"
import { cn } from "@/lib/utils"
import { getAllContentForLocale } from "@leadcms/sdk"
import { BlogCoverGenerator } from "@/components/blog/blog-cover-generator"
import { AlertCircle, CheckCircle, Info, AlertTriangle, Lightbulb } from "lucide-react"

// Blog Article Card Component
interface BlogCardProps {
  title: string
  excerpt: string
  slug: string
  author?: string
  publishedAt: string
  category?: string
  tags?: string[]
  readTime?: string
  coverImageUrl?: string
  coverImageAlt?: string
  featured?: boolean
}

export function BlogCard({
  title,
  excerpt,
  slug,
  author,
  publishedAt,
  category,
  tags,
  readTime,
  coverImageUrl,
  coverImageAlt,
  featured,
}: BlogCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <LocaleAwareLink href={`/${slug}`} className="block">
        <BlogCoverGenerator
          title={title}
          category={category}
          tags={tags}
          author={author}
          coverImageUrl={coverImageUrl}
          featured={featured}
        />
      </LocaleAwareLink>
      <CardHeader className="flex-1">
        <CardDescription className="line-clamp-3">{excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          {readTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <LocaleAwareLink href={`/${slug}`} className="w-full">
          <Button variant="ghost" className="w-full group">
            Read More
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </LocaleAwareLink>
      </CardFooter>
    </Card>
  )
}

// Featured Blog Article Component
interface FeaturedArticleProps {
  title: string
  excerpt: string
  slug: string
  author?: string
  publishedAt: string
  category?: string
  tags?: string[]
  coverImageUrl?: string
  coverImageAlt?: string
  readTime?: string
}

export function FeaturedArticle({
  title,
  excerpt,
  slug,
  author,
  publishedAt,
  category,
  tags,
  coverImageUrl,
  coverImageAlt,
  readTime,
}: FeaturedArticleProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="grid md:grid-cols-2 gap-0">
        <LocaleAwareLink href={`/${slug}`} className="block">
          <BlogCoverGenerator
            title={title}
            category={category}
            tags={tags}
            author={author}
            coverImageUrl={coverImageUrl}
            featured={true}
            size="hero"
          />
        </LocaleAwareLink>
        <div className="flex flex-col">
          <CardHeader className="pb-4">
            <CardDescription className="text-base line-clamp-4">
              {excerpt}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              {readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{readTime}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <LocaleAwareLink href={`/${slug}`} className="w-full">
              <Button className="w-full group" size="lg">
                Read Full Article
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </LocaleAwareLink>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}

// Blog Grid Container Component
interface BlogGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3
}

export function BlogGrid({ children, columns = 3 }: BlogGridProps) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }

  return (
    <div className={cn("grid gap-6", gridClasses[columns])}>
      {children}
    </div>
  )
}

// Blog Header Component
interface BlogHeaderProps {
  title: string
  description?: string
}

export function BlogHeader({ title, description }: BlogHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
      {description && (
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{description}</p>
      )}
    </div>
  )
}

// Blog Article Meta Component (for use in article pages)
interface BlogArticleMetaProps {
  author?: string
  publishedAt: string
  category?: string
  tags?: string[]
  readTime?: string
}

export function BlogArticleMeta({
  author,
  publishedAt,
  category,
  tags,
  readTime,
}: BlogArticleMetaProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-4 py-6 border-y border-border">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {author && (
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{author}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span>{formattedDate}</span>
        </div>
        {readTime && (
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{readTime}</span>
          </div>
        )}
      </div>
      {(category || (tags && tags.length > 0)) && (
        <div className="flex flex-wrap items-center gap-3">
          {category && <Badge variant="outline">{category}</Badge>}
          {tags &&
            tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
        </div>
      )}
    </div>
  )
}

// Blog Section Divider
interface BlogSectionProps {
  title?: string
  children: React.ReactNode
}

export function BlogSection({ title, children }: BlogSectionProps) {
  return (
    <section className="py-8">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      {children}
    </section>
  )
}

// Blog Index Hero - MDX Component for blog index page hero section
interface BlogIndexHeroProps {
  title?: string
  description?: string
  locale?: string
  showFeaturedPost?: boolean
}

export function BlogIndexHero({
  title,
  description,
  locale,
  showFeaturedPost = true,
}: BlogIndexHeroProps) {
  interface BlogPost {
    slug: string
    title: string
    description: string
    excerpt?: string
    author?: string
    publishedAt: string
    category?: string
    tags?: string[]
    featured?: boolean
    coverImageUrl?: string
    body: string
  }

  let featuredPost: BlogPost | null = null

  if (showFeaturedPost) {
    // ✨ Optimized: Single function call instead of 1 + N calls
    const blogContents = getAllContentForLocale(locale, ['blog-article'])
    const blogPosts: BlogPost[] = blogContents
      .filter((postContent: any) => postContent && postContent.type === 'blog-article')
      .map((postContent: any) => ({
        slug: postContent.slug,
        title: postContent.title || '',
        description: postContent.description || '',
        excerpt: (postContent.excerpt as string | undefined) || postContent.description || '',
        author: postContent.author,
        publishedAt: postContent.publishedAt || postContent.createdAt,
        category: postContent.category,
        tags: postContent.tags as string[] | undefined,
        featured: postContent.featured as boolean | undefined,
        coverImageUrl: postContent.coverImageUrl as string | undefined,
        body: postContent.body,
      } as BlogPost))
      .sort((a: BlogPost, b: BlogPost) => {
        // Sort featured posts first, then by published date
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      })

    featuredPost = blogPosts.length > 0 ? blogPosts[0] : null
  }

  const getReadTime = (body: string) => {
    const wordCount = body.split(/\s+/).length
    return `${Math.ceil(wordCount / 200)} min read`
  }

  const formattedDate = featuredPost
    ? new Date(featuredPost.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ''

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-slate-200 dark:bg-grid-slate-800/[0.04] bg-[size:32px_32px]" />
      <div className="absolute h-full w-full bg-gradient-to-t from-background/80 via-transparent to-transparent" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1750px] mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left side - Hero content */}
            <div className="flex flex-col items-center lg:items-start max-w-2xl mx-auto lg:mx-0">
              <div className="text-center lg:text-left w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight pb-1">
                  {title || "Blog"}
                </h1>
                {description && (
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 w-full lg:w-auto justify-center lg:justify-start">
                <a href="#articles" className="flex-1 lg:flex-initial">
                  <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    View All Articles
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                {featuredPost && (
                  <LocaleAwareLink href={`/${featuredPost.slug}`} className="flex-1 lg:flex-initial">
                    <Button size="lg" variant="outline" className="w-full border-2 hover:bg-muted/50">
                      Read Featured Post
                    </Button>
                  </LocaleAwareLink>
                )}
              </div>
            </div>

            {/* Right side - Featured post preview */}
            {featuredPost && showFeaturedPost && (
              <div className="relative">
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 bg-background/95 backdrop-blur">
                  <LocaleAwareLink href={`/${featuredPost.slug}`} className="block">
                    <BlogCoverGenerator
                      title={featuredPost.title}
                      category={featuredPost.category}
                      tags={featuredPost.tags}
                      author={featuredPost.author}
                      coverImageUrl={featuredPost.coverImageUrl}
                      featured={true}
                      size="hero"
                    />
                  </LocaleAwareLink>
                  <CardHeader>
                    <CardDescription className="text-base line-clamp-3 mt-2">
                      {featuredPost.excerpt || featuredPost.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {featuredPost.author && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{getReadTime(featuredPost.body)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// Blog Articles Section - MDX Component for listing all blog posts
interface BlogArticlesSectionProps {
  title?: string
  columns?: 1 | 2 | 3
  locale?: string
  userUid?: string | null
}

export function BlogArticlesSection({
  title = "Articles",
  columns = 3,
  locale,
  userUid,
}: BlogArticlesSectionProps) {
  interface BlogPost {
    slug: string
    title: string
    description: string
    excerpt?: string
    author?: string
    publishedAt: string
    category?: string
    tags?: string[]
    featured?: boolean
    coverImageUrl?: string
    body: string
  }

  // ✨ Optimized: Single function call instead of 1 + N calls
  // userUid enables draft content when provided
  const blogContents = getAllContentForLocale(locale, ['blog-article'], userUid as any)
  const blogPosts: BlogPost[] = blogContents
    .filter((postContent: any) => postContent && postContent.type === 'blog-article')
    .map((postContent: any) => ({
      slug: postContent.slug,
      title: postContent.title || '',
      description: postContent.description || '',
      excerpt: (postContent.excerpt as string | undefined) || postContent.description || '',
      author: postContent.author,
      publishedAt: postContent.publishedAt || postContent.createdAt,
      category: postContent.category,
      tags: postContent.tags as string[] | undefined,
      featured: postContent.featured as boolean | undefined,
      coverImageUrl: postContent.coverImageUrl as string | undefined,
      body: postContent.body,
    } as BlogPost))
    .sort((a: BlogPost, b: BlogPost) => {
      // Sort featured posts first, then by published date
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })

  // Calculate read time for each post
  const getReadTime = (body: string) => {
    const wordCount = body.split(/\s+/).length
    return `${Math.ceil(wordCount / 200)} min read`
  }

  if (blogPosts.length === 0) {
    return (
      <section id="articles" className="w-full py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1750px] mx-auto text-center">
            <p className="text-lg text-muted-foreground">
              No blog posts available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="articles" className="w-full py-12 bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1750px] mx-auto">
          <BlogSection title={title}>
            <BlogGrid columns={columns}>
              {blogPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt || post.description}
                  slug={post.slug}
                  author={post.author}
                  publishedAt={post.publishedAt}
                  category={post.category}
                  tags={post.tags}
                  readTime={getReadTime(post.body)}
                  coverImageUrl={post.coverImageUrl}
                  featured={post.featured}
                />
              ))}
            </BlogGrid>
          </BlogSection>
        </div>
      </div>
    </section>
  )
}

// Blog-specific Callout component (same as doc-components but optimized for blog styling)
interface BlogCalloutProps {
  type?: "note" | "tip" | "warning" | "danger" | "info" | "success"
  title?: string
  children: React.ReactNode
}

export function BlogCallout({ type = "info", title, children }: BlogCalloutProps) {
  const icons = {
    note: Info,
    tip: Lightbulb,
    warning: AlertTriangle,
    danger: AlertCircle,
    info: Info,
    success: CheckCircle,
  }

  const styles = {
    note: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
    tip: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
    warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
    danger: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
    info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
    success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
  }

  const Icon = icons[type]

  return (
    <div className={cn("border-l-4 p-4 my-6 rounded-r-lg", styles[type])}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          {title && <div className="font-semibold mb-2">{title}</div>}
          <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
