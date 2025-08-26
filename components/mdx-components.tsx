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
import { LegalSection, LegalList, ContactInfo, DisclaimerBox, PrivacyGrid, SecurityPractices, RightsGrid } from "./mdx/legal-section";

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
    // Legal components
    LegalSection,
    LegalList,
    ContactInfo,
    DisclaimerBox,
    PrivacyGrid,
    SecurityPractices,
    RightsGrid,
    ...components,
  }
}
