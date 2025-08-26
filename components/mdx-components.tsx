import type { MDXComponents } from "mdx/types"
import { CompareSection } from "./mdx/compare-section"
import mdxComponents from "@/components/mdx";
import { ContactFormSection } from "./mdx/contact-form-section";
import { HeroSection } from "./mdx/hero-section";
import { FeaturesSection } from "./mdx/features-section";
import { WhySection } from "./mdx/why-section";
import { DeploySection } from "./mdx/deploy-section";
import { HelpSection } from "./mdx/help-section";
import { ContactSection } from "./mdx/contact-section";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    HeroSection,
    FeaturesSection,
    WhySection,
    DeploySection,
    HelpSection,
    CompareSection,
    ContactSection,
    ContactFormSection,    
    ...components,
  }
}
