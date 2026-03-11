"use client"

import { SiteCalculatorClient } from "./site-calculator-client"
import { getSiteCalculatorConfig } from "@/lib/site-calculator-config"
import { useLocale } from "@/lib/locale-context"

export function SiteCalculator() {
  const locale = useLocale()
  const config = getSiteCalculatorConfig(locale)

  return (
    <section id="calculator" className="w-full py-8 md:py-12">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1750px] mx-auto">
          <SiteCalculatorClient pricing={config.pricing} labels={config.labels} />
        </div>
      </div>
    </section>
  )
}
