import React from "react";
import { MDXProvider } from "@mdx-js/react";
import mdxComponents from "@/components/mdxComponents";
import { Layout } from "@/components/layout";

export interface DefaultLayoutProps {
  children: React.ReactNode;
  timeToRead?: string;
  frontmatter?: {
    [key: string]: any;
  };
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ 
  children, 
  timeToRead,
  frontmatter 
}) => {
  return (
    <Layout>
      <main className="flex-1">
        <MDXProvider components={mdxComponents}>{children}</MDXProvider>
      </main>
    </Layout>
  );
};

export { DefaultLayout as default };
