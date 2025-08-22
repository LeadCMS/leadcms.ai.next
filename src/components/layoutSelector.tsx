import * as React from "react";
import { Helmet } from "react-helmet";
import { DefaultLayout } from "@/components/default/defaultLayout";
import { LandingLayout } from "@/components/landing/landingLayout";
import { BlogPostLayout } from "@/components/blog/blogPostLayout";
import { LegalLayout } from "@/components/legal/legalLayout";

interface LayoutSelectorProps {
    children: React.ReactNode;
    frontmatter?: Record<string, any>;
    timeToRead?: {
        text: string;
        minutes: number;
    };
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
    children,
    frontmatter,
    timeToRead,
}) => {
    const type = frontmatter?.type;
    const title = frontmatter?.title;
    const description = frontmatter?.description;
    const seoKeywords = frontmatter?.seoKeywords;

    // Use LandingLayout for type "home" or "landing", BlogPostLayout for "blog-post", LegalLayout for "legal", otherwise DefaultLayout
    const LayoutComponent =
        type === "home" || type === "landing"
            ? LandingLayout
            : type === "blog-post"
              ? BlogPostLayout
              : type === "legal"
                ? LegalLayout
                : DefaultLayout;

    return (
        <>
            <Helmet>
                {title && <title>{title}</title>}
                {description && <meta name="description" content={description} />}
                {seoKeywords && (
                    <meta
                        name="keywords"
                        content={Array.isArray(seoKeywords) ? seoKeywords.join(", ") : seoKeywords}
                    />
                )}
            </Helmet>
            <LayoutComponent frontmatter={frontmatter || {}} timeToRead={timeToRead?.text}>
                {children as React.ReactNode}
            </LayoutComponent>
        </>
    );
};

export { LayoutSelector as default };
