import config from '@/.leadcms/content/site-calculator-config.json'

export const siteCalculatorPricing = config.pricing
export const siteCalculatorLabels = config.labels

export type SiteCalculatorPricing = typeof config.pricing
export type SiteCalculatorLabels = typeof config.labels
