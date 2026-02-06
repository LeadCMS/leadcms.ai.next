import React from "react"
import type { MDXComponents } from "mdx/types"
import mdxComponents from "@/components/mdx"
import {
  HeroSection,
  HeroBadge,
  HeroTitle,
  HeroDescription,
  HeroButton,
  HeroButtons,
  HeroPreview,
} from "./mdx/hero-section"
import {
  FeaturesSection,
  FeaturesSectionTitle,
  FeaturesSectionDescription,
  FeaturesSectionHeader,
  FeaturesSectionCards,
  FeaturesCard,
  FeaturesCardWithBullets,
  FeatureBullet,
} from "./mdx/features-section"
import {
  WhySection,
  WhySectionTitle,
  WhySectionDescription,
  WhyReasonCard,
} from "./mdx/why-section"
import {
  CapabilitiesSection,
  CapabilitiesSectionTitle,
  CapabilitiesSectionDescription,
  CapabilityCard,
} from "./mdx/capabilities-section"
import { DeploySection, DeployCommands, DeployCards, DeployButton } from "./mdx/deploy-section"
import { ServicesSection, ServiceCard, ServiceList, ServiceButton } from "./mdx/services-section"
import { CTASection, CTAButton } from "./mdx/cta-section"
import { ContactFormSection, ContactFormServiceList, ContactForm } from "./mdx/contact-form-section"
import { CompareSection, CompareTab, CompareRow, CompareCell } from "./mdx/compare-section"
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
  ContactFormSectionNew,
  ContactLocationAndSocial,
  ContactCTA,
} from "./mdx/contact-components"
import { NotFoundSection } from "./mdx/error-components"
import {
  Callout,
  CodeBlock,
  FileTree,
  FileTreeItem,
  Steps,
  Step,
  ImageGallery,
  Tabs,
  FeatureCard,
  FeatureGrid,
} from "./mdx/doc-components"
import {
  BlogCard,
  BlogGrid,
  FeaturedArticle,
  BlogHeader,
  BlogArticleMeta,
  BlogSection,
  BlogArticlesSection,
  BlogIndexHero,
  BlogCallout,
} from "./mdx/blog-components"
import { ContactUs } from "./contact-us"
import { SiteCalculator } from "./site-calculator"
import { FAQSection, FAQItem, ContentSection } from "./mdx/faq-section"
import { MermaidDiagram } from "./ui/mermaid-diagram"
import { CodeTabs, CodeTab } from "./mdx/code-tabs"
import { OSTabs, OSTab } from "./mdx/os-tabs"

/**
 * Registry of all available MDX components with userUid context support.
 *
 * Usage in templates:
 * ```tsx
 * const components = useMDXComponents({ userUid })
 * ```
 *
 * Components that support draft content (like BlogArticlesSection) will
 * automatically receive userUid and include draft content when present.
 */
export function useMDXComponents(components: Record<string, any> = {}): MDXComponents {
  const { userUid, ...otherComponents } = components

  return {
    ...mdxComponents,
    HeroSection,
    HeroBadge,
    HeroTitle,
    HeroDescription,
    HeroButton,
    HeroButtons,
    HeroPreview,
    FeaturesSection,
    FeaturesSectionTitle,
    FeaturesSectionDescription,
    FeaturesSectionHeader,
    FeaturesSectionCards,
    FeaturesCard,
    FeaturesCardWithBullets,
    FeatureBullet,
    WhySection,
    WhySectionTitle,
    WhySectionDescription,
    WhyReasonCard,
    CapabilitiesSection,
    CapabilitiesSectionTitle,
    CapabilitiesSectionDescription,
    CapabilityCard,
    DeploySection,
    DeployCommands,
    DeployCards,
    DeployButton,
    ServicesSection,
    ServiceCard,
    ServiceList,
    ServiceButton,
    CompareSection,
    CompareTab,
    CompareRow,
    CompareCell,
    CTASection,
    CTAButton,
    ContactFormSection,
    ContactFormServiceList,
    ContactForm,
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
    // Documentation components
    Callout,
    CodeBlock,
    FileTree,
    FileTreeItem,
    Steps,
    Step,
    ImageGallery,
    Tabs,
    FeatureCard,
    FeatureGrid,
    // Blog components with userUid context
    BlogCard,
    BlogGrid,
    FeaturedArticle,
    BlogHeader,
    BlogArticleMeta,
    BlogSection,
    BlogArticlesSection: (props: any) => <BlogArticlesSection {...props} userUid={userUid} />,
    BlogIndexHero,
    BlogCallout,
    // Contact form
    ContactUs,
    // Site calculator
    SiteCalculator,
    // FAQ & content wrapper
    FAQSection,
    FAQItem,
    ContentSection,
    // Diagrams
    MermaidDiagram,
    // Tab controls
    CodeTabs,
    CodeTab,
    OSTabs,
    OSTab,
    ...otherComponents,
  }
}
