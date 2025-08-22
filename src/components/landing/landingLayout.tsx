import React from "react";
import { MDXProvider } from "@mdx-js/react";
import mdxComponents from "@/components/mdxComponents";
import { Layout } from "@/components/layout";

// Import section components (implement these separately)
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { FeaturesSection } from "@/components/landing/sections/FeaturesSection"; // Make sure FeaturesSection is a named export
import { WhySection } from "@/components/landing/sections/WhySection";
import { DeploySection } from "@/components/landing/sections/DeploySection";
import { HelpSection } from "@/components/landing/sections/HelpSection";
import { CompareSection } from "@/components/landing/sections/CompareSection";
import { ContactSection } from "@/components/landing/sections/ContactSection";
import { ContactFormSection } from "@/components/landing/sections/ContactFormSection";

// Properly merge the section components with the base MDX components
const allComponents = {
  ...mdxComponents,
  HeroSection,
  FeaturesSection,
  WhySection,
  DeploySection,
  HelpSection,
  CompareSection,
  ContactSection,
  ContactFormSection
};

export interface LandingLayoutProps {
  children: React.ReactNode;
  timeToRead?: string;
  frontmatter?: {
    [key: string]: any;
  };
}

export const LandingLayout: React.FC<LandingLayoutProps> = ({ 
  children, 
  timeToRead,
  frontmatter 
}) => {
  return (
    <Layout>
      <main className="flex-1">
        <MDXProvider components={allComponents}>{children}</MDXProvider>
      </main>
    </Layout>
  );
};

export { LandingLayout as default };
