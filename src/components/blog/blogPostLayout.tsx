import React from "react";
import { MDXProvider } from "@mdx-js/react";
import mdxComponents from "@/components/mdxComponents";
import { Layout } from "@/components/layout";
import { TableOfContents } from "./tableOfContents";

export interface BlogPostLayoutProps {
  children: React.ReactNode;
  timeToRead?: string;
  frontmatter: {
    title?: string;
    description?: string;
    tags?: string[];
    author?: string;
    publishedAt?: string;
    coverImageUrl?: string;
    coverImageAlt?: string;
    [key: string]: any;
  };
}

export const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({
  children,
  timeToRead,
  frontmatter,
}) => {
  const { title, description, tags, author, publishedAt, coverImageUrl, coverImageAlt } = frontmatter;
  return (
    <Layout>
      <section className="w-full bg-background border-b border-muted/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-6 md:pb-8">
          <div className={`grid gap-6 md:gap-8 ${coverImageUrl ? 'md:grid-cols-2 lg:grid-cols-5' : 'max-w-4xl mx-auto'} items-center`}>
            {/* Content Section */}
            <div className={`flex flex-col gap-3 ${coverImageUrl ? 'lg:col-span-3' : ''}`}>
              <div className="flex flex-wrap gap-2">
                {tags?.map((tag) => (
                  <span key={tag} className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-primary leading-tight">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                {author && <span>By <span className="font-semibold text-foreground">{author}</span></span>}
                {publishedAt && <span className="opacity-70">{publishedAt}</span>}
                {timeToRead && <span className="opacity-70">{timeToRead}</span>}
              </div>
            </div>
            
            {/* Cover Image Section */}
            {coverImageUrl && (
              <div className="lg:col-span-2">
                <img 
                  src={coverImageUrl}
                  alt={coverImageAlt || title || "Blog post cover image"} 
                  className="w-full h-auto rounded-lg object-cover aspect-video shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </section>
      <main className="flex-1 w-full min-w-0">
        <div className="container max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 w-full min-w-0">
          {/* Mobile TOC - Outside of grid for better positioning */}
          <div className="lg:hidden pt-4 md:pt-6">
            <TableOfContents />
          </div>
          
          <div className="grid lg:grid-cols-4 gap-8 pt-6 md:pt-8 lg:pt-6 md:lg:pt-8 pb-4 md:pb-6 lg:pb-8 w-full min-w-0">
            {/* Main Content */}
            <div className="lg:col-span-3 w-full min-w-0">
              <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:break-words prose-p:break-words prose-li:break-words w-full min-w-0 mobile-safe [&>*]:max-w-full [&>*]:break-words [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_code]:break-all [&_code]:max-w-full [&_a]:break-all px-4 sm:px-0">
                <MDXProvider components={mdxComponents}>{children}</MDXProvider>
              </article>
            </div>
            
            {/* Desktop TOC Sidebar */}
            <div className="hidden lg:block lg:col-span-1 w-full min-w-0">
              <div className="sticky-toc">
                <TableOfContents />
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export { BlogPostLayout as default };
