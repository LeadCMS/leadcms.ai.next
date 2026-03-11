import enConfig from '@/.leadcms/content/site-calculator-config.json'
import ruConfig from '@/.leadcms/content/ru/site-calculator-config.json'

const siteCalculatorConfigByLocale = {
    en: enConfig,
    ru: ruConfig,
} as const

export const siteCalculatorPricing = enConfig.pricing
export const siteCalculatorLabels = enConfig.labels

export type SiteCalculatorPricing = typeof enConfig.pricing
export type SiteCalculatorLabels = typeof enConfig.labels

export function getSiteCalculatorConfig(locale: string) {
    return siteCalculatorConfigByLocale[locale as keyof typeof siteCalculatorConfigByLocale] || enConfig
}
