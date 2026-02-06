"use client"

import { SiteCalculatorClient } from "./site-calculator-client"
import { siteCalculatorPricing, siteCalculatorLabels } from "@/lib/site-calculator-config"

export function SiteCalculator() {
  return (
    <section id="calculator" className="w-full py-8 md:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1750px] mx-auto">
          <SiteCalculatorClient pricing={siteCalculatorPricing} labels={siteCalculatorLabels} />
        </div>
      </div>
    </section>
  )
}
