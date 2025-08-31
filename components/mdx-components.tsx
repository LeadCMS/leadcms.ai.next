import type { MDXComponents } from "mdx/types"
import { CompareSection } from "./mdx/compare-section"
import mdxComponents from "@/components/mdx"
import { ContactFormSection } from "./mdx/contact-form-section"
import { HeroSection } from "./mdx/hero-section"
import { FeaturesSection } from "./mdx/features-section"
import { WhySection } from "./mdx/why-section"
import { DeploySection } from "./mdx/deploy-section"
import { HelpSection } from "./mdx/help-section"
import { ContactSection } from "./mdx/contact-section"
import {
  LegalSection,
  LegalList,
  ContactInfo,
  DisclaimerBox,
  PrivacyGrid,
  SecurityPractices,
  RightsGrid,
} from "./mdx/legal-components"
import {
  ContactHero,
  ContactHeroWithOptions,
  ContactFormSection as ContactFormSectionNew,
  ContactLocationAndSocial,
  ContactCTA,
} from "./mdx/contact-components"
import { NotFoundSection } from "./mdx/error-components"
import { ContactUs } from "./contact-us"

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
    // Contact components
    ContactHero,
    ContactHeroWithOptions,
    ContactFormSectionNew,
    ContactLocationAndSocial,
    ContactCTA,
    // Error components
    NotFoundSection,
    // Contact form
    ContactUs,
    ...components,
  }
}
