// Contact form text loaded from JSON files
import type { ContactUsText } from '@/components/contact-us-localized'

// Import contact form configurations from JSON files
import enConfig from '@/.leadcms/content/contact-us-form.json'
import ruConfig from '@/.leadcms/content/ru/contact-us-form.json'
import daConfig from '@/.leadcms/content/da/contact-us-form.json'

export const contactFormTextByLocale: Record<string, ContactUsText> = {
  en: enConfig.contactFormText,
  ru: ruConfig.contactFormText,
  da: daConfig.contactFormText,
}

export function getContactFormText(locale: string): ContactUsText {
  return contactFormTextByLocale[locale] || contactFormTextByLocale.en
}
