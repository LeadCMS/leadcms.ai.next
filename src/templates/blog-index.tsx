import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogPost {
    id: string;
    fields: {
        timeToRead: {
            text: string;
            minutes: number;
            time: number;
            words: number;
        };
    };
    frontmatter: {
        slug: string;
        title: string;
        description?: string;
        tags?: string[];
        author?: string;
        publishedAt?: string;
        coverImageUrl?: string;
        coverImageAlt?: string;
    };
    excerpt: string;
}

interface BlogIndexData {
    allMdx: {
        nodes: BlogPost[];
        totalCount: number;
    };
}

interface BlogIndexProps extends PageProps<BlogIndexData> {
    pageContext: {
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        sortedPostIds: string[];
    };
}

const BlogIndex: React.FC<BlogIndexProps> = ({ data, pageContext }) => {
    const { allMdx } = data;
    const { currentPage, totalPages, hasNextPage, hasPreviousPage, sortedPostIds } = pageContext;

    // Sort posts according to the order provided by gatsby-node.ts
    const posts = React.useMemo(() => {
        if (!sortedPostIds || sortedPostIds.length === 0) {
            return allMdx.nodes;
        }

        // Create a map for quick lookup
        const postsMap = new Map(allMdx.nodes.map(post => [post.id, post]));

        // Return posts in the sorted order
        return sortedPostIds
            .map(id => postsMap.get(id))
            .filter((post): post is BlogPost => post !== undefined);
    }, [allMdx.nodes, sortedPostIds]);

    return (
        <>
            <Helmet>
                <title>Blog - LeadCMS</title>
                <meta
                    name="description"
                    content="Read the latest articles and insights about headless CMS, content management, and web development."
                />
            </Helmet>

            <section className="w-full bg-background border-b border-muted/60">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-8 md:pb-12">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4">
                            Blog
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Discover insights, tutorials, and best practices for modern content
                            management and web development.
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="w-full py-12 md:py-16">
                <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Posts Count and Page Info */}
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-sm text-muted-foreground">
                            Showing {(currentPage - 1) * 15 + 1} -{" "}
                            {Math.min(currentPage * 15, allMdx.totalCount)} of {allMdx.totalCount}{" "}
                            articles
                        </p>
                        {totalPages > 1 && (
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </p>
                        )}
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
                                No blog posts found
                            </h2>
                            <p className="text-muted-foreground">
                                Check back later for new content!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {posts.map(post => (
                                <Card
                                    key={post.id}
                                    className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200"
                                >
                                    {post.frontmatter.coverImageUrl && (
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={post.frontmatter.coverImageUrl}
                                                alt={
                                                    post.frontmatter.coverImageAlt ||
                                                    post.frontmatter.title
                                                }
                                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                                            />
                                        </div>
                                    )}

                                    <CardHeader className="flex-1">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {post.frontmatter.tags?.slice(0, 3).map(tag => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <CardTitle className="text-xl mb-2">
                                            <Link
                                                to={`/${post.frontmatter.slug}`}
                                                className="hover:text-primary transition-colors block"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {post.frontmatter.title}
                                            </Link>
                                        </CardTitle>

                                        {post.frontmatter.description && (
                                            <CardDescription
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {post.frontmatter.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-4">
                                                {post.frontmatter.author && (
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        <span>{post.frontmatter.author}</span>
                                                    </div>
                                                )}
                                                {post.frontmatter.publishedAt && (
                                                    <div className="flex items-center gap-1">
                                                        <CalendarDays className="h-4 w-4" />
                                                        <span>
                                                            {new Date(
                                                                post.frontmatter.publishedAt
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs">
                                                {post.fields.timeToRead.text}
                                            </span>
                                        </div>

                                        <Button asChild variant="outline" className="w-full">
                                            <Link to={`/${post.frontmatter.slug}`}>
                                                Read More
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            {hasPreviousPage && (
                                <Button asChild variant="outline">
                                    <Link
                                        to={
                                            currentPage === 2
                                                ? "/blog"
                                                : `/blog/page/${currentPage - 1}`
                                        }
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Previous
                                    </Link>
                                </Button>
                            )}

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum: number;

                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    const isActive = pageNum === currentPage;
                                    const href = pageNum === 1 ? "/blog" : `/blog/page/${pageNum}`;

                                    return (
                                        <Button
                                            key={pageNum}
                                            asChild
                                            variant={isActive ? "default" : "outline"}
                                            size="sm"
                                            className="w-10 h-10"
                                        >
                                            <Link to={href}>{pageNum}</Link>
                                        </Button>
                                    );
                                })}
                            </div>

                            {hasNextPage && (
                                <Button asChild variant="outline">
                                    <Link to={`/blog/page/${currentPage + 1}`}>
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export const query = graphql`
    query BlogIndex($skip: Int!, $limit: Int!, $postIds: [String]!) {
        allMdx(
            filter: { frontmatter: { type: { eq: "blog-post" } }, id: { in: $postIds } }
            skip: $skip
            limit: $limit
        ) {
            totalCount
            nodes {
                id
                excerpt(pruneLength: 160)
                fields {
                    timeToRead {
                        text
                        minutes
                        time
                        words
                    }
                }
                frontmatter {
                    slug
                    title
                    description
                    tags
                    author
                    publishedAt
                    coverImageUrl
                    coverImageAlt
                }
            }
        }
    }
`;

export default BlogIndex;
