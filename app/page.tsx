import { HeroSection } from "@/src/components/landing/sections/HeroSection"
import { FeaturesSection } from "@/src/components/landing/sections/FeaturesSection"
import { WhySection } from "@/src/components/landing/sections/WhySection"
import { DeploySection } from "@/src/components/landing/sections/DeploySection"
import { HelpSection } from "@/src/components/landing/sections/HelpSection"
import { CompareSection } from "@/src/components/landing/sections/CompareSection"
import { ContactSection } from "@/src/components/landing/sections/ContactSection"
import { ContactFormSection } from "@/src/components/landing/sections/ContactFormSection"
import { getContentData } from "@/lib/content"

export default function HomePage() {
  const { heroData, featuresData, whyData, compareData, contactData, deployData, helpData } = getContentData()

  return (
    <>
      <HeroSection {...heroData} />
      <FeaturesSection {...featuresData} />
      <WhySection {...whyData} />
      <DeploySection {...deployData} />
      <HelpSection {...helpData} />
      <CompareSection {...compareData} />
      <ContactSection {...contactData} />
      <ContactFormSection />
    </>
  )
}
