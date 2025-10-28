import type { MDXComponents } from "mdx/types"
import mdxComponents from "@/components/mdx"
import {
  HeroSection,
  HeroBadge,
  HeroTitle,
  HeroDescription,
  HeroButton,
  HeroButtons,
  HeroPreview
} from "./mdx/hero-section"
import {
  FeaturesSection,
  FeaturesSectionTitle,
  FeaturesSectionDescription,
  FeaturesSectionHeader,
  FeaturesSectionCards,
  FeaturesCard,
  FeaturesCardWithBullets,
  FeatureBullet
} from "./mdx/features-section"
import { WhySection, WhySectionTitle, WhySectionDescription, WhyReasonCard } from "./mdx/why-section"
import { CapabilitiesSection, CapabilitiesSectionTitle, CapabilitiesSectionDescription, CapabilityCard } from "./mdx/capabilities-section"
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
import { MermaidDiagram } from "./ui/mermaid-diagram"

export function useMDXComponents(components: MDXComponents): MDXComponents {
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
    // Blog components
    BlogCard,
    BlogGrid,
    FeaturedArticle,
    BlogHeader,
    BlogArticleMeta,
    BlogSection,
    BlogArticlesSection,
    BlogIndexHero,
    BlogCallout,
    // Contact form
    ContactUs,
    // Diagrams
    MermaidDiagram,
    ...components,
  }
}
