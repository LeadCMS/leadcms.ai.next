import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import mdxComponents from "@/components/mdxComponents";
import { LegalSection } from "@/components/legal/sections/LegalSection";
import { LegalListItem } from "@/components/legal/sections/LegalListItem";

export interface LegalLayoutProps {
  children: React.ReactNode;
  frontmatter?: {
    title?: string;
    description?: string;
    lastUpdated?: string;
    [key: string]: any;
  };
}

// Override MDX elements for legal look
const legalMdxComponents = {
  ...mdxComponents,
  h1: (props: React.ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl mb-2 text-center" {...props} />
  ),
  h2: (props: React.ComponentPropsWithoutRef<'h2'>) => {
    // If LegalSection is used in MDX, h2 will not be rendered. This is a fallback for pure MDX.
    return <LegalSection title={props.children as string}>{null}</LegalSection>;
  },
  h3: (props: React.ComponentPropsWithoutRef<'h3'>) => (
    <div className="text-lg font-semibold mt-6 mb-2" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<'p'>) => (
    <p className="text-muted-foreground mb-4" {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4" {...props} />
  ),
  li: (props: React.ComponentPropsWithoutRef<'li'>) => (
    <LegalListItem>{props.children}</LegalListItem>
  ),
  blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4" {...props} />
  ),
  LegalSection,
};

export const LegalLayout: React.FC<LegalLayoutProps> = ({ children, frontmatter }) => {
  const { title, description, lastUpdated } = frontmatter || {};
  return (
    <Layout>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Legal</Badge>
            {title && <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">{title}</h1>}
            {lastUpdated && <p className="mt-4 text-lg text-muted-foreground">Last Updated: {lastUpdated}</p>}
            {description && <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{description}</p>}
          </div>
          <div className="max-w-4xl mx-auto">
            <MDXProvider components={legalMdxComponents}>{children}</MDXProvider>
          </div>
        </div>
      </section>
    </Layout>
  );
};
